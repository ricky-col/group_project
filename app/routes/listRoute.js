import exp from "express";
import { authMiddleware } from "../middleware/authmiddleware.js";
import ListModel from "../models/List.js";
import { getIO } from "../socket.js";
import CardModel from "../models/Card.js"; //  ADD THIS
export const listRouter = exp.Router();



listRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const activeCards = await CardModel.countDocuments({
      listId: req.params.id,
      isDeleted: false
    });

    if (activeCards > 0) {
      return res.status(400).json({ message: "Cannot delete a list that has active cards" });
    }

    const list = await ListModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    //  SAFE SOCKET
    try {
      const io = getIO();
      if (list.boardId) io.to(list.boardId.toString()).emit("listDeleted", list);
      else io.emit("listDeleted", list);
    } catch {}

    res.json({
      message: "List deleted",
      list
    });

  } catch (err) {
    console.log("DELETE LIST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// CREATE LIST

listRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, boardId } = req.body;

    const list = new ListModel({
      title,
      boardId
    });

    await list.save();

    //  SAFE SOCKET
    try {
      const io = getIO();
      if (list.boardId) io.to(list.boardId.toString()).emit("listCreated", list);
      else io.emit("listCreated", list);
    } catch (err) {
      console.log("Socket not ready", err);
    }

    res.status(201).json({
      message: "List created successfully",
      payload: list
    });

  } catch (err) {
    console.log("LIST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET LISTS BY BOARD
listRouter.get("/get/:boardId", authMiddleware, async (req, res) => {
  try {
    const { boardId } = req.params;

    const lists = await ListModel.find({
      boardId,
      isDeleted: false
    }).sort({ position: 1 });

    res.status(200).json({
      message: "Lists fetched successfully",
      payload: lists
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching lists" });
  }
});

// REORDER LIST
listRouter.put("/reorder", authMiddleware, async (req, res) => {
  try {
    const { listId, newPosition } = req.body;

    const list = await ListModel.findByIdAndUpdate(
      listId,
      { position: newPosition },
      { new: true }
    );

    const io = getIO();
    if (list.boardId) io.to(list.boardId.toString()).emit("listReordered", list);
    else io.emit("listReordered", list);

    res.json({
      message: "List reordered",
      payload: list
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error reordering list" });
  }
});

listRouter.put("/update/:id",authMiddleware,async(req,res)=>{
    try{

        let {id} = req.params;
        let {title} = req.body;

        const updatedList = await ListModel.findByIdAndUpdate(id,{title},{new:true})
        if (!updatedList)
        {
            return res.status(404).json({message:"List not found"})
        }

        try {
          const io = getIO();
          if (updatedList.boardId) io.to(updatedList.boardId.toString()).emit("listUpdated", updatedList);
          else io.emit("listUpdated", updatedList);
        } catch (err) {
          console.log("Socket emit listUpdated failed", err);
        }

        res.status(200).json({
            message:"List updated successfully",
            payload:updatedList
        })
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({
      message: "Error fetching lists"
    });
    }
});

listRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const { id } = req.params;

    const activeCards = await CardModel.countDocuments({
      listId: id,
      isDeleted: false
    });

    if (activeCards > 0) {
      return res.status(400).json({ message: "Cannot delete a list that has active cards" });
    }

    const list = await ListModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!list) {
      return res.status(404).json({
        message: "List not found"
      });
    }

    try {
      const io = getIO();
      if (list.boardId) io.to(list.boardId.toString()).emit("listDeleted", list);
      else io.emit("listDeleted", list);
    } catch (err) {
      console.log("Socket emit listDeleted failed", err);
    }

    res.status(200).json({
      message: "List deleted successfully",list
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error deleting list"
    });
  }
});



