import { Container } from "@mui/material";
import { React, useState, useEffect } from "react";
import styles from "../styles/blog.module.css";
import BlogPosts from "./components/BlogPosts";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = () => {
    setIsLoading(true);
    fetch("http://localhost:8080/blog-posts/all")
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("Failed to fetch blog posts");
      })
      .then((data) => {
        if (data.blogPosts) setPosts(data.blogPosts);
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.title}>
          <a>Posts</a>
        </div>
        <div className={styles.grid}>
          {isLoading && <h1>loading...</h1>}
          {posts.length > 0 && (
            <div>
              <p style={{ textAlign: "left" }}>{posts.length} posts found</p>
              <BlogPosts {...{ posts }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
