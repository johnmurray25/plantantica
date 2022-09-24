// import {EventContext, pubsub} from "firebase-functions/v1";
// import admin, {firestore} from "firebase-admin";
// import nodemailer from "nodemailer";
// // import cors from "cors";
// import Plant from "./domain/Plant";
// import {DocumentSnapshot, QueryDocumentSnapshot}
//   from "firebase-functions/v1/firestore";

// // const crossOrigin = cors({origin: true});
// admin.initializeApp();
// const db = firestore();

// interface DBUser {
//   plantTrackingDetails?: Plant[];
//   profilePicture: string;
//   email: string;
//   username?: string;
//   displayName?: string
// }

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "plantantica@gmail.com",
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// const MILLIS_IN_DAY = 86400000;

// const mapDocsToPlants = (docs: QueryDocumentSnapshot[]) => {
//   return docs.map((doc): Plant => {
//     return {
//       id: doc.id,
//       species: doc.get("species"),
//       dateObtained: new Date(doc.get("dateObtained")),
//       daysBetweenWatering: doc.get("daysBetweenWatering"),
//       dateLastWatered: new Date(doc.get("dateLastWatered")),
//       dateToWaterNext: new Date(doc.get("dateToWaterNext")),
//       dateLastFed: doc.get("dateLastFed"),
//       dateToFeedNext: doc.get("dateToFeedNext"),
//       lightRequired: doc.get("lightRequired"),
//       dateCreated: new Date(doc.get("dateCreated")),
//       picture: doc.get("picture"),
//     };
//   })
//       .map((plant) => {
//       // Only assign feeding dates if not null
//         if (plant.dateLastFed) {
//           plant.dateLastFed = new Date(plant.dateLastFed);
//         }
//         if (plant.dateToFeedNext) {
//           plant.dateToFeedNext = new Date(plant.dateToFeedNext);
//         }
//         return plant;
//       });
// };

// const getPlants = async (uid: string): Promise<Plant[]> => {
//   if (!uid) {
//     return [];
//   }
//   // Load all plant tracking data for current user
//   const plantsRef = db.collection(`users/${uid}/plantTrackingDetails`);
//   const trackingDetails = await plantsRef.get();
//   return mapDocsToPlants(trackingDetails.docs);
// };

// const mapDocToUser = async (docSnap: QueryDocumentSnapshot |
//   DocumentSnapshot): Promise<DBUser> => {
//   let plants: Plant[] = [];
//   try {
//     plants = await getPlants(docSnap.id);
//   } catch (e) {
//     console.error(e);
//   }

//   const email = docSnap.get("email");

//   return {
//     plantTrackingDetails: plants,
//     profilePicture: docSnap.get("profilePicture"),
//     email: email ? email : docSnap.id,
//     username: docSnap.get("username"),
//     displayName: docSnap.get("displayName"),
//   };
// };

// const getAllUsers = async () => {
//   const usersRef = db.collection("users");
//   const userDocs = await usersRef.get();
//   const results = userDocs.docs.map(mapDocToUser);
//   return results;
// };

// const sendMail = (dest: string, message: string) => {
//   //   crossOrigin(req, res, () => {
//   // getting dest email by query string
//   // const dest = String(req.query.dest);

//   const mailOptions = {
//     from: "plantantica@gmail.com",
//     to: dest,
//     subject: "Your plants might be thirsty...",
//     html: `<p style="font-size: 16px;">${message}</p>
//                 <br />
//             `,
//   };

//   // Send email
//   return transporter.sendMail(mailOptions,
//   // Callback -> handle error:
//       (erro, /**  , info: unknown */) => {
//         if (erro) {
//           console.error("Error sending email: " + erro.toString());
//         }
//         console.log("Successfully sent email to " + dest);
//       });
// };


// const hasCheckState = (dateLastWatered: Date): boolean => {
//   if (!dateLastWatered) return false;
//   return dateLastWatered.getTime() - new Date().getTime() >= 0;
// };

// const hasBadState = (dateLastWatered: Date): boolean => {
//   if (!dateLastWatered) return false;
//   return dateLastWatered.getTime() - new Date().getTime() >= 3 * MILLIS_IN_DAY;
// };

// const sendEmails = async (context: EventContext) => {
//   console.log("This will be run every morning. Today's date is " +
//     new Date().toLocaleDateString());

//   console.log(context.resource);
//   console.log(context.auth);
//   console.log(context.authType);

//   const plantsToCheck: Plant[] = [];
//   const plantsToWater: Plant[] = [];

//   (await getAllUsers())
//       .forEach((promise) => {
//         promise.then((user) => {
//           console.log(`Checking status of plants for 
//                 ${user.username ? `@${user.username}` : user.email}`);
//           if (user.plantTrackingDetails &&
//             user.plantTrackingDetails.length > 0) {
//             user.plantTrackingDetails.forEach((plant) => {
//               if (!plant.dateLastWatered) {
//                 return;
//               }
//               if (hasBadState(plant.dateLastWatered)) {
//                 console.log(plant.species + " probably needs to be watered");
//                 plantsToWater.push(plant);
//               } else if (hasCheckState(plant.dateLastWatered)) {
//                 console.log(`You should check your ${plant.species}' soil`);
//                 plantsToCheck.push(plant);
//               }
//             });
//           }
//         }).catch(console.error);
//       });

//   let message = "";

//   if (plantsToWater.length > 0) {
//     message = "Plants that probably need to be watered: " +
//            plantsToWater.join();
//   }

//   if (plantsToCheck.length > 0) {
//     if (message.length > 0) {
//       message += "\n";
//     }
//     message += "Plants to check if need water: " + plantsToCheck.join();
//   }

//   if (message.length > 0) {
//     sendMail("jmurray2598@gmail.com", message);
//   } else {
//     sendMail("jmurray2598@gmail.com", "Your plants are all good for now!");
//   }
// };

// exports.emailNotificationCron = pubsub
//     .schedule("1 8 * * *")
//     .timeZone("America/New_York")
//     .onRun(sendEmails);
