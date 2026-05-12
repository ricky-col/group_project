import { Schema, model } from "mongoose";

const activitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  action: {
    type: String
  },

  cardId: {
    type: Schema.Types.ObjectId,
    ref: "Card"
  },

  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board"
  }

}, { timestamps: true });

export default model("Activity", activitySchema);