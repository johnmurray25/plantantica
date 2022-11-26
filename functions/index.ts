import {EventContext, pubsub} from "firebase-functions/v1";
import admin, {firestore} from "firebase-admin";
import nodemailer from "nodemailer";
// import cors from "cors";
import Plant from "../domain/Plant";
import {DocumentSnapshot, QueryDocumentSnapshot}
  from "firebase-functions/v1/firestore";
import moment from "moment";
import {docToPlant} from "./DBMappings";

// const crossOrigin = cors({origin: true});
admin.initializeApp();
const db = firestore();

interface DBUser {
  plantTrackingDetails?: Plant[];
  profilePicture: string;
  email: string;
  username?: string;
  displayName?: string,
  dailyEmails?: boolean,
}

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mapDocsToPlants = (docs: QueryDocumentSnapshot[]) => {
  return docs.map(docToPlant);
};

const docToUser = async (docSnap: QueryDocumentSnapshot |
  DocumentSnapshot): Promise<DBUser> => {
  let plants: Plant[] = [];
  try {
    // plants = await getPlants(docSnap.id);
    plants = mapDocsToPlants((await db.collection(
        `users/${docSnap.id}/plantTrackingDetails`).get()).docs) as Plant[];
  } catch (e) {
    console.error(e);
  }

  const email = docSnap.get("email");

  return {
    plantTrackingDetails: plants,
    profilePicture: docSnap.get("profilePicture"),
    email: email ? email : docSnap.id,
    username: docSnap.get("username"),
    displayName: docSnap.get("displayName"),
    dailyEmails: docSnap.get("dailyEmails"),
  };
};

const getAllUsers = async () => {
  const usersRef = db.collection("users");
  const userDocs = await usersRef.get();
  return userDocs.docs.map(docToUser);
};

const sendMail = (dest: string, message: string) => {
  const today = new Date().toString().split(" ").slice(1, 3).join(" ");
  const mailOptions = {
    from: "Plantantica <plantantica@gmail.com>",
    to: dest,
    subject: `Daily Watering Status: ${today}`,
    html: message,
  };

  // Send email
  return transporter.sendMail(mailOptions,
      // Callback -> handle error:
      (erro, /**  , info: unknown */) => {
        if (erro) {
          console.error("Error sending email: " + erro.toString());
        } else {
          console.log("Successfully sent email to " + dest);
        }
      });
};

const waterNext = (d: Date, d2?: Date): string => {
  const n = d2 ? moment(d2).diff(d, "days") : moment().diff(d, "days");
  switch (n) {
    case 0:
      return "today";
    case 1:
      return "yesterday";
    default:
      return `${n} days ago`;
  }
};

const processUser = (u: DBUser): void => {
  const today = moment();

  console.log(`Checking status of plants for 
              ${u.username ? `@${u.username}` : u.email}`);
  if (!u.dailyEmails) {
    console.log(`${u.email} is not subscribed to daily emails`);
    return;
  }
  if (!u.plantTrackingDetails) {
    console.log(`${u.email} is not tracking any plants`);
    return;
  }
  // Check status of each plant
  const thePlants: Plant[] = u.plantTrackingDetails.filter((plant) => {
    console.log(plant.species + ":");
    const waterNext = plant.dateToWaterNext;
    if (new Date().toLocaleDateString() != waterNext.toLocaleDateString() &&
        today.isBefore(waterNext)) {
      return false;
    }
    const daysAgo = today.diff(waterNext, "days");
    console.log(`${waterNext.toLocaleDateString()} was ${daysAgo} days ago`);
    return true;
  });

  if (!thePlants.length) {
    console.log("No plants need to be watered today");
    return;
  }

  const message = `
    <main style="background-color:white;color:black;
                  text-align:center;z-index:100;padding:12px;
                  margin:auto;"
      >
      <div style="display:flex;width:100%;justify-content:center;
                  margin:auto;">
        <div style="margin:auto;">
          <img src="https://firebasestorage.googleapis.com/v0/b/plantantica.appspot.com/o/tree-logo-with-text.png?alt=media&token=29b1381d-962b-47d9-8ea7-66067ff4bae4" 
            alt="Plantantica logo" width="300" height="100">
        </div>
      </div>
      <h2 style="font-weight:bold;margin-bottom:12px;text-align:center;">
        You might want to check if these plants need water:
      </h2>
      <ul style="padding:10px;width:fit-content;margin:auto;
                 margin-bottom:20px;padding-top:0px;">
      ${thePlants.map((p) => `
        <li style="font-size:large;${today.diff(p.dateToWaterNext) >= 2 ?
            "color:red;" : ""}>
          <span style="font-weight:bold;">
            ${p.species}:
          </span>
          water next 
          <span style="font-weight:bold;">
            ${waterNext(p.dateToWaterNext)} 
          </span>
        </li>`).join(" ")}
      </ul>
      <div style="display:flex;justify-content:center;width:100%;">
        <a href="https://plantantica.com/Tracking" 
          style="padding:15px;margin:auto;background-color:#e8ffec;
          color:green;border: 1px solid green;font-weight:bold;
          text-align:center;border-radius:2px;text-decoration:none;" 
        >
          Go to Plantantica &rarr;
        </a>
      </div>
      <div style="text-align:center;font-size:small;padding-top:5px;">
        *Always check the moisture levels in the soil before watering. 
          Feel free to adjust "days between watering" as needed.
      </div>
      <div style="display:flex;justify-content:center;width:100%;margin:auto;">
        <p style="text-align:center;padding-right:10px;">
          You can unsubscribe from emails in your settings.
        </p>
        <p>|</p>
        <p style="text-align:center;padding-left:10px;">
          Questions? Concerns? Ideas? Respond directly to this email.
        </p>
      </div>
    </main>
  `;

  console.log(message);
  if (u.email === "jmurray2598@gmail.com") {
    console.log(`Sending email to ${u.email}`);
    sendMail(u.email, message);
  }
};

const sendEmails = async (context: EventContext) => {
  console.log(context.resource);
  console.log(
      "Daily Email Reminders: \n" +
      "This function is run every morning to remind users " +
      "if their plants need water. Today's date is " +
        new Date().toLocaleDateString());

  const users = await Promise.all(await getAllUsers());

  console.log(`Retrieved data for ${users.length} users`);

  users.forEach(processUser);
};

exports.sendDailyEmails = pubsub
    .schedule("30 9 * * *")
    .timeZone("America/New_York")
    .onRun(sendEmails);
