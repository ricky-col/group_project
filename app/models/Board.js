// import {Schema,model} from "mongoose"

// const boardSchema = new Schema({
//     title:{
//         type:String,
//         required:true
//     },
//     owner:{
//         type:Schema.Types.ObjectId,
//         ref:"User",
//         required:true
//     },
//     members: [
//   {
//     type: Schema.Types.ObjectId,
//     ref: "User"
//   }
// ],

// pendingInvites: [
//   {
//     email: String,
//     token: String
//   }
// ],
//     isDeleted:{
//         type:Boolean,
//         default:false
//     }
// },{timestamps:true})
 
//  const BoardModel = model("Board",boardSchema)

//  export default BoardModel;


import { Schema, model } from "mongoose";

const boardSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  pendingInvites: [
    {
      email: String,
      token: String
    }
  ],

  isDeleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

const BoardModel = model("Board", boardSchema);

export default BoardModel;