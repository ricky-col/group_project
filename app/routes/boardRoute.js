import exp from "express";
import BoardModel from "../models/Board.js";
import UserModel from "../models/User.js";
import { authMiddleware } from "../middleware/authmiddleware.js";
import { getIO } from "../socket.js";
import { v4 as uuidv4 } from "uuid";
import { sendInviteMail } from "../utils/sendMail.js";

const boardRouter = exp.Router();

// get all members across user's boards
boardRouter.get("/members", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userID;

    const boards = await BoardModel.find({
      $or: [{ owner: userId }, { members: userId }],
      isDeleted: false
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    // build map of unique users -> their boards
    const memberMap = {};

    for (const board of boards) {
      if (board.owner) {
        const oid = board.owner._id.toString();
        if (!memberMap[oid]) {
          memberMap[oid] = {
            _id: oid,
            name: board.owner.name,
            email: board.owner.email,
            boards: []
          };
        }
        memberMap[oid].boards.push({ _id: board._id, title: board.title });
      }

      for (const m of board.members || []) {
        const mid = m._id.toString();
        if (!memberMap[mid]) {
          memberMap[mid] = {
            _id: mid,
            name: m.name,
            email: m.email,
            boards: []
          };
        }
        if (!memberMap[mid].boards.find(b => b._id.toString() === board._id.toString())) {
          memberMap[mid].boards.push({ _id: board._id, title: board.title });
        }
      }
    }

    res.json({
      message: "Members fetched",
      members: Object.values(memberMap)
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching members" });
  }
});

// get starred board ids for current user
boardRouter.get("/starred", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userID).select("starredBoards");
    res.json({
      message: "Starred boards fetched",
      starredBoardIds: user?.starredBoards || []
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching starred boards" });
  }
});

// toggle star/unstar a board
boardRouter.put("/star/:id", authMiddleware, async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.userID;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.starredBoards.indexOf(boardId);
    if (index === -1) {
      user.starredBoards.push(boardId);
    } else {
      user.starredBoards.splice(index, 1);
    }

    await user.save();

    res.json({
      message: index === -1 ? "Board starred" : "Board unstarred",
      starredBoardIds: user.starredBoards
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error toggling star" });
  }
});

// create board
boardRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    if (!req.user || !req.user.userID) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const board = new BoardModel({
      title,
      owner: req.user.userID,
      members: []
    });

    await board.save();

    try {
      const io = getIO();
      io.emit("boardCreated", board);
    } catch (err) {
      console.log("Socket not ready");
    }

    res.status(201).json({
      message: "Board created",
      board
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// get all boards for current user
boardRouter.get("/get", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userID;

    const boards = await BoardModel.find({
      $or: [
        { owner: userId },
        { members: userId }
      ],
      isDeleted: false
    });

    res.status(200).json({
      message: "Boards fetched successfully",
      payload: boards
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching boards" });
  }
});

// get single board by id
boardRouter.get("/get/:id", authMiddleware, async (req, res) => {
  try {
    const board = await BoardModel.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json({
      message: "Board fetched successfully",
      board
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching board" });
  }
});

// soft delete board
boardRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const board = await BoardModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    try {
      const io = getIO();
      io.emit("boardDeleted", board);
    } catch {}

    res.json({
      message: "Board deleted successfully",
      board
    });

  } catch (err) {
    res.status(500).json({ message: "Error deleting board" });
  }
});

// update board
boardRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, members } = req.body;

    const board = await BoardModel.findByIdAndUpdate(
      req.params.id,
      { title, members },
      { new: true }
    );

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    try {
      const io = getIO();
      io.emit("boardUpdated", board);
    } catch {}

    res.json({
      message: "Board updated successfully",
      board
    });

  } catch (err) {
    res.status(500).json({ message: "Error updating board" });
  }
});

// generate board invite link
boardRouter.post("/invite", authMiddleware, async (req, res) => {
  try {
    const { boardId } = req.body;

    const token = uuidv4();

    await BoardModel.findByIdAndUpdate(boardId, {
      $push: {
        pendingInvites: { email: "link-share", token }
      }
    });

    const inviteLink = `https://group-project-1ep9.onrender.com/invite/${token}`;

    res.json({ message: "Invite link generated", inviteLink });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message || "Error generating invite", error: String(err) });
  }
});

// accept invite and join board
boardRouter.post("/accept-invite", authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;

    const board = await BoardModel.findOne({
      "pendingInvites.token": token
    });

    if (!board) {
      return res.status(404).json({ message: "Invalid invite" });
    }

    if (!board.members.includes(req.user.userID)) {
      board.members.push(req.user.userID);
    }

    board.pendingInvites = board.pendingInvites.filter(
      (i) => i.token !== token
    );

    await board.save();

    res.json({ message: "Joined board" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error joining board" });
  }
});

export default boardRouter;