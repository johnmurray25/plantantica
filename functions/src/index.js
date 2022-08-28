// import firebase from "firebase-admin";
import {https} from "firebase-functions";
import next from "next";

// firebase.initializeApp();

const dev = process.env.NODE_ENV !== "production";
const app = next({dev: false, conf: {distDir: "../../public"}});
console.log(`Hostname: ${app.hostname}`);
const handle = app.getRequestHandler();

export const server = https.onRequest((request, response) => {
  console.log("File: " + request.originalUrl);
  return app.prepare().then(() => handle(request, response));
});
