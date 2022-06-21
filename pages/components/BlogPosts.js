import React, { useState } from "react";
import styles from "../../styles/blog.module.css";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";

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
        <IconButton className={styles.icon}>
          <AddCircleOutlineRoundedIcon fontSize="large"/>
        </IconButton>
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
              <IconButton className={styles.icon}>
                <EditIcon textAlign="right" />
              </IconButton>
            </p>
            <h4>{post.body}</h4>
          </a>
        </div>
      ))}
    </div>
  );
}

export default BlogPosts;
