
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

// Connect to new database called blogDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster1.4158yrd.mongodb.net/blogDB`, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(() => { 
    console.log("Database Connected");

    const port = process.env.PORT || 3000;
    
    app.listen(port, function() {
        console.log(`Server started on port ${port}`);
    });
})
.catch((err) => { console.log(err)});


const homeStartingContent = "Welcome to our blog! We share interesting stories, useful tips, and insightful articles on a wide range of topics. Explore our collection of posts to discover new ideas and perspectives.";
const aboutContent = "At our blog, we are passionate about providing valuable content to our readers. Our team of writers consists of experts in various fields who are dedicated to delivering high-quality articles that inspire, educate, and entertain. Get to know us better as we continue our mission of sharing knowledge and creativity with the world.";
const contactContent = "Have a question or feedback? We would love to hear from you! Reach out to us using the contact form below, and we'll get back to you as soon as possible. Your opinions matter to us, and we are always open to suggestions for improvement.";


// Create a new postSchema that contains a title and content
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

// Create a new mongoose model using the schema to define your posts collection
const Post = mongoose.model("Post", postSchema);


// GET request to "/" home route
app.get("/", async function(req,res) {
    try {
        // console.log(posts);    
        const posts = await Post.find({});

        res.render("home", {
            home: homeStartingContent,
            allPosts: posts
        });

    } catch (err) {
        console.log(err);
    }

});

// GET request to "/about" route
app.get("/about", function(req,res) {
    res.render("about", {
        about: aboutContent
    });
});

// GET request to "/contact" route
app.get("/contact", function(req,res) {
    res.render("contact", {
        contact: contactContent
    });
});

// GET request to "/compose" route
app.get("/compose", function(req,res) {
    res.render("compose");
});


// POST request to "/compose" route
app.post("/compose", async function(req,res) {
    try {
        const post = new Post({
            title: req.body.postTitle,
            content: req.body.postBody
        });

        // Save the document to your database instead of pushing to the posts array
        await post.save();

        res.redirect("/"); // Redirect to the root route after successful save

    } catch (err) {
        console.log(err);
    }

});


// Express Routing Parameters  --> Dynamic url
// GET request to "/posts/:postId" route using Express Routing Parameters  --> Dynamic url
app.get("/posts/:postId", async function(req,res) {
    try {
        const requestedPostId = req.params.postId;

        // Use await with Post.findOne() to wait for the database query to complete
        const post = await Post.findOne({ _id: requestedPostId });

        if (!post) {
            // If the post is not found, you can redirect to another route or render an error page
            console.log("Post not found")
            return;
        }

        res.render("post", {
            title: post.title,
            content: post.content
        });

    } catch (err) {
        console.log(err);
    }   

});


