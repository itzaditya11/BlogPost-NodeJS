const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const expressSanitizer = require("express-sanitizer");

app=express();
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
const blogSchema = new mongoose.Schema ({
    title: String,
    image:String,
    body:String,
    created: {type:Date,default:Date.now}

});

const blog = mongoose.model("Blog", blogSchema );
///blog.create({
    ///title:"test blog",
    ///image:"https://i.pinimg.com/originals/9b/b0/39/9bb03959e368702a2c5e0a6241eb02cf.jpg",
   /// body:"hello this is a blog post"
///}),

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log("error");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
});

app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    })
});

app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlog})
        }
    });   
});

app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    });   
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
        if(err){
            console.log(err);
        } else {
          var showUrl = "/blogs/" + blog._id;
          res.redirect(showUrl);
        }
    });
 });

 app.delete("/blogs/:id", function(req, res){
    blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        } else {
            blog.remove();
            res.redirect("/blogs");
        }
    }); 
 });

app.listen(3000,function(){
    console.log("go baby");
});