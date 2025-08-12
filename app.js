
    require("dotenv").config();

const { urlencoded } = require("body-parser");
const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");
const {nanoid} = require("nanoid");
const mongoose = require("mongoose");
const { mainModule } = require("process");
const Url = require("./models/schema.js");

app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");


app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({extended:true}));

const db_Url = process.env.MONGO_URL;

main()
    .then(()=>{
        console.log("connected successfully");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main() {
    await mongoose.connect(db_Url);
}

app.get("/api" , (req,res)=>{
    res.render("form", {short : null});
})

app.post("/api/shorten", async(req,res)=>{
    let {url} = req.body;
    let shorturl = "https://localhost:5000/"+nanoid(6);
    const url1 = new Url({
        originalUrl : url,
        shortUrl : shorturl,
    })
    await url1.save();
    res.render("form", {short : url1});
})

app.get("/:shortcode", async(req,res)=>{
    try{
    let {shortcode} = req.params;
    let findurl = await  Url.findOne({shortUrl : shortcode});
    res.redirect(findurl.originalUrl);
    }
    catch(err){
        res.status(500).send("Server error");
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
})