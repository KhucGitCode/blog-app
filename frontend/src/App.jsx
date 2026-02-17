import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 fetch posts
  const fetchPosts = () => {
    setLoading(true);

    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🔹 create post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    // 🔥 UPDATE MODE
    if (editingId) {
      await fetch(`http://localhost:5000/posts/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      setEditingId(null);
    }
    // 🔥 CREATE MODE
    else {
      await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
    }

    setTitle("");
    setContent("");
    fetchPosts();
  };

  // 🔹 delete post
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/posts/${id}`, {
      method: "DELETE",
    });

    fetchPosts(); // refresh list
  };

 return (
  <div className="page">
    <div className="app-container">
      <h1 className="app-title">📝 Blog App</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit" className="create-btn">
          {editingId ? "Update Post" : "Create Post"}
        </button>
      </form>

      {/* POSTS */}
      <div className="posts-wrapper">
        {loading ? (
          <p className="empty-text">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="empty-text">No posts yet...</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>

              <div className="btn-group">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setTitle(post.title);
                    setContent(post.content);
                    setEditingId(post.id);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
}

export default App;

