// // import exp from "express";
// // import BoardModel from "../models/Board.js";
// // import { authMiddleware } from "../middleware/authmiddleware.js";
// // import { getIO } from "../socket.js";
// // import { v4 as uuidv4 } from "uuid";
// // import { sendInviteMail } from "../utils/sendMail.js";

// // const boardRouter = exp.Router();

// // const io = getIO();

// // boardRouter.post("/create", authMiddleware, async (req,res)=>{
// //   try{

// //     const { title, members } = req.body;

// //     const board = new BoardModel({
// //       title,
// //       owner: req.user.userID,
// //       members
// //     });
// //     io.emit("boardCreated", board);


// //     await board.save();

// //     res.status(201).json({
// //       message:"Board created successfully",
// //       board
// //     });

// //   }catch(err){
// //     res.status(500).json({message:"Error creating board"});
// //   }
// // });

// // //get all boards
// // // boardRouter.get('/get', authMiddleware, async (req,res)=>{
// // //  try{

// // //   const userId = req.user.userID;

// // //   const boards = await BoardModel.find({
// // //     $or: [
// // //       { owner: userId },
// // //       { members: userId }
// // //     ],
// // //     isDeleted: false
// // //   });

// // //   res.status(200).json({
// // //     message:"Boards fetched successfully",
// // //     boards
// // //   });

// // //  } catch(err){
// // //   res.status(500).json({message:"Error fetching boards"});
// // //  }
// // // });


// // boardRouter.get('/get', authMiddleware, async (req,res)=>{
// //  try{

// //   const userId = req.user.userID;

// //   console.log("Logged in user:", userId);

// //   const boards = await BoardModel.find({
// //     $or: [
// //       { owner: userId },
// //       { members: userId }
// //     ],
// //     isDeleted: false
// //   });

// //   console.log("Boards found:", boards);

// //   res.status(200).json({
// //     message:"Boards fetched successfully",
// //     payload: boards
// //   });

// //  } catch(err){
// //   console.log(err);
// //   res.status(500).json({message:"Error fetching boards"});
// //  }
// // });

// // //get board by id
// // boardRouter.get('/get/:id',authMiddleware,async(req,res)=>{
// //     try{
// //         let {id} = req.params
// //         const board =await BoardModel.findById(id)

// //         if(!board){
// //             return res.status(404).json({message:"Board not found"});
// //         }

// //         res.status(200).json({message:"Board fetched successfully",board})
// //     }
// //     catch(err)
// //     {
// //         res.status(500).json({message:"Error fetching board"});
// //     }
// // })

// // boardRouter.delete('/delete/:id',authMiddleware,async(req,res)=>{
// //     try{
// //         let boardId = req.params.id;
// //         const board = await BoardModel.findByIdAndUpdate(boardId,{
// //             isDeleted:true},{new:true}
// //         )
// //                 io.emit("boardDeleted", board);


// //         if(!board){
// //             return res.status(404).json({message:"Board not found"});
// //         }

// //         res.status(200).json({message:"Board deleted successfully",board});
// //     }
// //     catch(err)
// //     {
// //         res.status(500).json({message:"Error deleting board"});
// //     }

// // })

// // boardRouter.put("/:id", authMiddleware, async (req, res) => {
// //   try {

// //     const boardId = req.params.id;
// //     const { title, members } = req.body;

// //     const board = await BoardModel.findByIdAndUpdate(
// //       boardId,
// //       {
// //         title,
// //         members
// //       },
// //       { new: true }
// //     );
// //         io.emit("boardUpdated", board);


// //     if (!board) {
// //       return res.status(404).json({
// //         message: "Board not found"
// //       });
// //     }

// //     res.status(200).json({
// //       message: "Board updated successfully",
// //       board
// //     });

// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).json({
// //       message: "Error updating board"
// //     });
// //   }
// // });


// // boardRouter.post("/invite", authMiddleware, async (req, res) => {
// //   try {
// //     const { email, boardId } = req.body;

// //     const token = uuidv4();

// //     const board = await BoardModel.findByIdAndUpdate(
// //       boardId,
// //       {
// //         $push: {
// //           pendingInvites: { email, token }
// //         }
// //       },
// //       { new: true }
// //     );

// //     const inviteLink = `http://localhost:5173/invite/${token}`;

// //     await sendInviteMail(email, inviteLink);

// //     res.json({ message: "Invite sent" });

// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).json({ message: "Error sending invite" });
// //   }
// // });

// // boardRouter.post("/accept-invite", authMiddleware, async (req, res) => {
// //   try {
// //     const { token } = req.body;

// //     const board = await BoardModel.findOne({
// //       "pendingInvites.token": token
// //     });

// //     if (!board) {
// //       return res.status(404).json({ message: "Invalid invite" });
// //     }

// //     // ✅ ADD USER
// //     if (!board.members.includes(req.user.id)) {
// //       board.members.push(req.user.id);
// //     }

// //     // ✅ REMOVE INVITE
// //     board.pendingInvites = board.pendingInvites.filter(
// //       (i) => i.token !== token
// //     );

// //     await board.save();

// //     res.json({ message: "Joined board" });

// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).json({ message: "Error joining board" });
// //   }
// // });


// // export default boardRouter;


// import exp from "express";
// import BoardModel from "../models/Board.js";
// import { authMiddleware } from "../middleware/authmiddleware.js";
// import { getIO } from "../socket.js";
// import { v4 as uuidv4 } from "uuid";
// import { sendInviteMail } from "../utils/sendMail.js";

// const boardRouter = exp.Router();
// let io;

// try {
//   io = getIO();
// } catch (err) {
//   console.log("Socket not initialized yet");
// }
// console.log("✅ BoardRoute Loaded");
// // ==========================
// // ✅ CREATE BOARD
// // ==========================
// boardRouter.post("/create", authMiddleware, async (req, res) => {
//   try {
// console.log("REQ.USER:", req.user);     // 🔥 ADD

//     const { title } = req.body;

//     if (!title) {
//       return res.status(400).json({ message: "Title required" });
//     }

//     const board = new BoardModel({
//       title,
//       owner: req.user.userID,
//       members: []
//     });

//     await board.save();

//     res.status(201).json({
//       message: "Board created",
//       board
//     });

//   } catch (err) {
//   console.log("🔥 REAL ERROR:", err);   // VERY IMPORTANT
//   res.status(500).json({ message: err.message });
// }
// });


// // ==========================
// // ✅ GET BOARDS (IMPORTANT)
// // ==========================
// boardRouter.get("/get", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.userID;

//     console.log("Logged in user:", userId);

//     const boards = await BoardModel.find({
//       $or: [
//         { owner: userId },
//         { members: userId }
//       ],
//       isDeleted: false
//     });

//     console.log("Boards found:", boards);

//     res.status(200).json({
//       message: "Boards fetched successfully",
//       payload: boards
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Error fetching boards" });
//   }
// });


// // ==========================
// // ✅ GET SINGLE BOARD
// // ==========================
// boardRouter.get("/get/:id", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const board = await BoardModel.findById(id);

//     if (!board) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     res.status(200).json({
//       message: "Board fetched successfully",
//       board
//     });

//   } catch (err) {
//     res.status(500).json({ message: "Error fetching board" });
//   }
// });


// // ==========================
// // ✅ DELETE BOARD
// // ==========================
// boardRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
//   try {
//     const boardId = req.params.id;

//     const board = await BoardModel.findByIdAndUpdate(
//       boardId,
//       { isDeleted: true },
//       { new: true }
//     );

//     io.emit("boardDeleted", board);

//     if (!board) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     res.status(200).json({
//       message: "Board deleted successfully",
//       board
//     });

//   } catch (err) {
//     res.status(500).json({ message: "Error deleting board" });
//   }
// });


// // ==========================
// // ✅ UPDATE BOARD
// // ==========================
// boardRouter.put("/:id", authMiddleware, async (req, res) => {
//   try {
//     const boardId = req.params.id;
//     const { title, members } = req.body;

//     const board = await BoardModel.findByIdAndUpdate(
//       boardId,
//       { title, members },
//       { new: true }
//     );

//     io.emit("boardUpdated", board);

//     if (!board) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     res.status(200).json({
//       message: "Board updated successfully",
//       board
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Error updating board" });
//   }
// });


// // ==========================
// // ✅ SEND INVITE
// // ==========================
// boardRouter.post("/invite", authMiddleware, async (req, res) => {
//   try {
//     const { email, boardId } = req.body;

//     const token = uuidv4();

//     const board = await BoardModel.findByIdAndUpdate(
//       boardId,
//       {
//         $push: {
//           pendingInvites: { email, token }
//         }
//       },
//       { new: true }
//     );

//     const inviteLink = `http://localhost:5173/invite/${token}`;

//     await sendInviteMail(email, inviteLink);

//     res.json({ message: "Invite sent" });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Error sending invite" });
//   }
// });


// // ==========================
// // ✅ ACCEPT INVITE (FIXED 🔥)
// // ==========================
// boardRouter.post("/accept-invite", authMiddleware, async (req, res) => {
//   try {
//     const { token } = req.body;

//     const board = await BoardModel.findOne({
//       "pendingInvites.token": token
//     });

//     if (!board) {
//       return res.status(404).json({ message: "Invalid invite" });
//     }

//     // ✅ FIXED USER ID
//     if (!board.members.includes(req.user.userID)) {
//       board.members.push(req.user.userID);
//     }

//     // ✅ REMOVE INVITE
//     board.pendingInvites = board.pendingInvites.filter(
//       (i) => i.token !== token
//     );

//     await board.save();

//     res.json({ message: "Joined board" });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Error joining board" });
//   }
// });
// export default boardRouter;

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

// send board invite email
boardRouter.post("/invite", authMiddleware, async (req, res) => {
  try {
    const { email, boardId } = req.body;

    const token = uuidv4();

    await BoardModel.findByIdAndUpdate(boardId, {
      $push: {
        pendingInvites: { email, token }
      }
    });

    const inviteLink = `https://group-project-1ep9.onrender.com/invite/${token}`;

    await sendInviteMail(email, inviteLink);

    res.json({ message: "Invite sent" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending invite" });
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