import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Ensure db url is defined
const url = process.env.DB_URL;

mongoose.connect(url)
  .then(async () => {
    console.log("Connected to MongoDB for Migration");
    
    // Import models manually to run outside of app context easily or just grab standard schema
    const listSchema = new mongoose.Schema({ boardId: mongoose.Schema.Types.ObjectId }, { strict: false });
    const List = mongoose.models.List || mongoose.model("List", listSchema);
    
    const cardSchema = new mongoose.Schema({ listId: mongoose.Schema.Types.ObjectId, boardId: mongoose.Schema.Types.ObjectId }, { strict: false });
    const Card = mongoose.models.Card || mongoose.model("Card", cardSchema);

    const cards = await Card.find({ boardId: { $exists: false } });
    console.log(`Found ${cards.length} cards missing boardId.`);

    for (let card of cards) {
      if (!card.listId) continue;
      const list = await List.findById(card.listId);
      if (list && list.boardId) {
        card.boardId = list.boardId;
        await card.save();
        console.log(`Updated card ${card._id} with boardId ${list.boardId}`);
      }
    }
    
    console.log("Migration finished.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
