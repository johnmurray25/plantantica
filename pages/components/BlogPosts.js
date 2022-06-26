import React, { useState } from "react";
import styles from "../../styles/blog.module.css";

function BlogPosts(props) {
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString();
  }

  const [posts, setPosts] = useState(props.posts);

  return (
    <div>
      <div style={{ textAlign: "right", color: "#063a20" }}>
        Add a post!
      </div>
      {posts.map((post) => (
        <div key={post.postId} className={[styles.card]}>
          <a>
            <h2>{post.title}</h2>
            <p
              style={{
                fontSize: "0.7rem",
                textAlign: "right",
              }}
            >
              by {post.author}, <br></br>
              {formatDate(post.dateCreated)}
              <br></br>
              <br></br>
            </p>
            <h4>{post.body}</h4>
          </a>
        </div>
      ))}
    </div>
  );
}

export default BlogPosts;
