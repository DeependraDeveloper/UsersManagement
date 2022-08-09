require('dotenv').config()
const express=require("express");
const mongoose  = require('mongoose');

const app=express();
const route=require("./routes/route")

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use("/",route)

const url = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.4nkid.mongodb.net/USMS`;

mongoose.connect(url,{useNewUrlParser:true})
.then(()=>console.log("connected to database"))
.catch((err)=>console.log(err))

app.listen(process.env.PORT || 3030 ,()=>console.log(`server running on port ${process.env.PORT}`))