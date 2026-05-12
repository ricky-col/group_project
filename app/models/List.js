import { Schema, model } from "mongoose"

const listSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: "Board"
    },
    position: {
        type: Number,
        default: 0
    },
    isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true
    
 })

const ListModel = model("List", listSchema)

export default ListModel;

