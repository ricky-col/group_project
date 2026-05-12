import {Schema,model} from "mongoose"

const cardSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
  type:String,
  default:""
},
  listId: {
  type: Schema.Types.ObjectId,
  ref: "List",
  required: true
},
  boardId: {
  type: Schema.Types.ObjectId,
  ref: "Board",
  required: true
},
    position:{
        type:Number
    },
    attachments:{
        type:[],
        default:[]
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    dueDate: {
        type: Date,
        default: null
    },
    labels: {
        type: [String],
        default: []
    },
    checklist: [
  {
    text: String,
    completed: Boolean
  }
],
attachments: [
  {
    url: String,
    name: String
  }
]
},{timestamps:true})

const CardModel = model("Card",cardSchema)

export default CardModel