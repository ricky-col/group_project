import exp from "express";
import { authMiddleware } from "../middleware/authmiddleware.js";
import CardModel from "../models/Card.js";
import ActivityModel from "../models/Activity.js";
import { getIO } from "../socket.js";
import mongoose from "mongoose";
import { upload } from "../middleware/upload.js";


export const cardRouter = exp.Router();



// import exp from "express";
// import { authMiddleware } from "../middleware/authmiddleware.js";
// import CardModel from "../models/Card.js";
// import ActivityModel from "../models/Activity.js";
// import { getIO } from "../socket.js";

// export const cardRouter = exp.Router();

// ==========================
// ✅ CREATE CARD
// ==========================
cardRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, listId, boardId } = req.body;

    if (!title || !listId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const card = new CardModel({
      title,
      description,
      listId,
      boardId,
    });

    await card.save();

    // ✅ ACTIVITY LOG
    await ActivityModel.create({
      action: "created a card",
      cardId: card._id,
      listId: card.listId,
      boardId,
      userId: req.user.userID,
    });

    // ✅ SAFE SOCKET (IMPORTANT)
    try {
      const io = getIO();
      if (card.boardId) io.to(card.boardId.toString()).emit("cardCreated", card.toObject());
      else io.emit("cardCreated", card.toObject());
    } catch (err) {
      console.log("Socket not ready");
    }

    res.status(201).json({
      message: "Card created successfully",
      payload: card,
    });

  } catch (err) {
    console.log("🔥 CREATE CARD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// ✅ GET CARDS
// ==========================
cardRouter.get("/get/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const cards = await CardModel.find({
      listId: id,
      isDeleted: false
    }).sort({ position: 1 });

    res.status(200).json({
      message: "Cards fetched successfully",
      payload: cards
    });

  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ message: "Error fetching cards" });
  }
});


// ==========================
// ✅ UPDATE CARD (DESC + CHECKLIST)
// ==========================
cardRouter.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, checklist, boardId, dueDate, labels } = req.body;

    const card = await CardModel.findByIdAndUpdate(
      id,
      { title, description, checklist, dueDate, labels },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    await ActivityModel.create({
      action: "updated card",
      cardId: card._id,
      listId: card.listId,
      boardId, // ✅ IMPORTANT
      userId: req.user.userID,
    });

    if (card.boardId) getIO().to(card.boardId.toString()).emit("cardUpdated", card.toObject());
    else getIO().emit("cardUpdated", card.toObject());

    res.json({
      message: "updated",
      payload: card,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating card" });
  }
});

// ==========================
// ✅ DELETE CARD (SOFT)
// ==========================
cardRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { boardId } = req.body;

    const card = await CardModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    await ActivityModel.create({
      action: "deleted card",
      cardId: card._id,
      listId: card.listId,
      boardId, // ✅ IMPORTANT
      userId: req.user.userID,
    });

    if (card.boardId) getIO().to(card.boardId.toString()).emit("cardDeleted", card.toObject());
    else getIO().emit("cardDeleted", card.toObject());

    res.json({
      message: "deleted",
      payload: card,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting card" });
  }
});

// ==========================
// ✅ REORDER CARD
// ==========================
cardRouter.put("/reorder", authMiddleware, async (req, res) => {
  try {
    const { cardId, newPosition } = req.body;

    const card = await CardModel.findByIdAndUpdate(
      cardId,
      { position: newPosition },
      { new: true }
    );

    const io = getIO();
    if (card.boardId) io.to(card.boardId.toString()).emit("cardReordered", card);
    else io.emit("cardReordered", card);

    res.json({
      message: "Card reordered",
      payload: card
    });

  } catch (err) {
    res.status(500).json({ message: "Error reordering card" });
  }
});


// ==========================
// ✅ MOVE CARD
// ==========================
cardRouter.put("/move", authMiddleware, async (req, res) => {
  try {
    const { cardId, newListId, newPosition } = req.body;

    const card = await CardModel.findByIdAndUpdate(
      cardId,
      {
        listId: newListId,
        position: newPosition
      },
      { new: true }
    );

    const io = getIO();
    if (card.boardId) io.to(card.boardId.toString()).emit("cardMoved", card);
    else io.emit("cardMoved", card);

    res.json({
      message: "Card moved",
      payload: card
    });

  } catch (err) {
    res.status(500).json({ message: "Error moving card" });
  }
});


import cloudinary from "../utils/cloudinary.js";

cardRouter.post("/upload/:id", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const result = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) throw error;

        const card = await CardModel.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              attachments: {
                url: result.secure_url,
                name: file.originalname
              }
            }
          },
          { new: true }
        );

        res.json(card);
      }
    );

    result.end(file.buffer);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed" });
  }
});