const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;


let posts = [];
let currentId = 1;

app.get("/", (req, res) => {
  res.send("Blog API running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create Post
app.post("/posts", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }

  const newPost = {
    id: currentId++,
    title,
    content,
    createdAt: new Date()
  };

  posts.push(newPost);

  res.status(201).json(newPost);
});

// Get All Posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Update Post
app.put("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  const post = posts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (title) post.title = title;
  if (content) post.content = content;

  res.json(post);
});

// Delete Post
app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = posts.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  posts.splice(index, 1);

  res.json({ message: "Post deleted successfully" });
});

