const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const notificationSchema = new Schema({

email:{type:String,required: true},
text:{type:String, required:true},
type:{type:String, required:true},
objectURI:{type:String, required:true}
}, {timestamps:true})


const  Notification= mongoose.model("Notification", notificationSchema);

module.exports=Notification;