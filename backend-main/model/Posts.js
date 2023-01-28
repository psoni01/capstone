const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const postSchema = new Schema({

email:{type:String,required: true},
text:{type:String, required:true},
images: {type:String, default: ""}
})


const  Post= mongoose.model("Post", postSchema);

module.exports=Post;