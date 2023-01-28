const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const userDetailsSchema = new Schema({
name :{type:String,required: true},
skills:{type:String,enum:["Developer","UX/UI Designer","Banking","Business", "Medical", "Others"]},
email:{type:String,required: true},
age:{type:String,required: true},
interest:{type:String},
job_title:{type:String},    
bio:{type:String},   
education:{type:String, enum: ["Undergraduate", "Graduate", "Post Graduate","PhD", "Doctorate"]},     
gender:{type:String,enum:["Male","Female","Others"]},
location:{type:String},
connections:{type:Array, 'default':[]},
notificationEnabled: {type:Boolean, 'default':false},
expoToken: {type:String, 'default': ""},
image: {type:String, 'default': ""},
pinned: {type:Array, 'default':[]}
})


const  UserDetails= mongoose.model("UserDetails", userDetailsSchema)

module.exports=UserDetails;
