import express, { text } from "express";
import nodemailer from "nodemailer";
import cron from "node-cron";
import "dotenv/config";
import { readFiles, updateSheet } from "./googleSheet.js";
import moment from "moment-timezone";
import axios from "axios";
import { sendWhatsAppNotification } from "./whatsAppNotification.js";

const app = express();
const port = process.env.PORT || 6900;

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "umera.ng",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "communications@umera.ng" || process.env.USER,
    pass: process.env.PASS,
  },
});

// console.log(process.env.USER)
// console.log(process.env.PASS)

app.use("/keepAppAlive", (req, res) => {
  console.log("Keeping Server Alive");
  res.send("App is Alive");
});

app.use("/getSMSRes", (req, res) => {
  console.log("Keeping Server Alive");
  res.send(`Thank You`);
  console.log(req.body);
});

app.use("/", (req, res) => {
  console.log("Keeping Server Alive");
  res.send(`This is an App for Email Automation Using Googlesheet and Nodemailer by Odunsi Oluwabukola.
    All the thing wey i write for top na perspe, Make i no lie , Coding Hard die!
    `);
});

const sendEmiailNotificationToSelf = async (email, name) => {
  try {
    const mailInfo = {
      from: "communications@umera.ng" || process.env.USER,
      to: "communications@umera.ng" || process.env.USER,
      subject: "Birthday Wish Notification",
      text: `A Birthday Wish was sent to ${name}, Email : ${email}`,
    };

    await transporter.sendMail(mailInfo, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("email Notification sent:", info.response);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

const sendBirthdayEmail = async (name, email) => {
  const mailOptions = {
    from: "communications@umera.ng" || process.env.USER,
    to: email,
    subject: `Happy Birthday, ${name}!`,
    html: `
    <h1>Dear ${name} 🎉🎂</h1>
    <img src='cid:unique@umera.ng' width='100%'/>
    <hr>
    <p style="font-size: 14px; color: #555;">Follow us on:</p>
    <p>
    <a href="https://www.facebook.com/umerafarms" target="_blank">Facebook</a> | 
    <a href="https://www.instagram.com/umera.ng" target="_blank">Instagram</a> | 
    </p>
    <p style="font-size: 12px; color: #999;">UMéRA Nigeria Limited &copy; ${new Date().getFullYear()}. All rights reserved.</p>
    `,
    attachments: [
      {
        filename: "HBD-umera.png",
        path: "./images/HBD-umera.png",
        cid: "unique@umera.ng",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    const timezone = "Africa/Lagos"; // Specify your timezone
    const now = moment.tz(timezone);
    const today = now.format("MM-DD"); // format MM-DD
    function getSimpleTimeAndDay() {
      // Format time, day and year using toLocaleTimeString with options
      const time = now.format("HH:mm:ss");
      const day = now.format("dddd");
      const year = now.year();

      return { time, day, year };
    }
    const { time, day, year } = getSimpleTimeAndDay();
    // let message = `Hello Olamide😇,
    // The Birthday Wish was sent to ${name} at ${time} on ${day}, ${year} bythe Email Automation Created by Odunsi Oluwabukola(LappiConnect)™️`
    // sendWhatsAppNotification(message)
    console.log(`Birthday email sent to: ${email}`);
  } catch (err) {
    console.error("Error sending email: ", err);
  }

  return "The Send Email Function worked correctly";
};

const checkBirthdaysAndSendEmails = async () => {
  const data = await readFiles();
  const timezone = "Africa/Lagos"; // Specify your timezone
  const now = moment.tz(timezone);
  const today = now.format("MM-DD"); // format MM-DD
  function getSimpleTimeAndDay() {
    // Format time, day and year using toLocaleTimeString with options
    const time = now.format("HH:mm:ss");
    const day = now.format("dddd");
    const year = now.year();

    return { time, day, year };
  }
  const { time, day, year } = getSimpleTimeAndDay();
  console.log(`Current time: ${time}`);
  console.log(`Today is: ${day}`);

  console.log(today);
  // console.log(data);

  for (let row of data) {
    const name = row[0];
    const email = row[1];
    const birthday = row[2];
    const sent = row[3];

    // console.log(name);
    // console.log(email);
    // console.log(birthday);
    try {
      if (birthday.slice(5, 10) === today && !sent) {
        try {
          await sendBirthdayEmail(name, email)
            .then((res) => {
              sendEmiailNotificationToSelf(email, name);
              console.log(res);
            })
            .catch((err) => console.error(err));
          // Update the sheet to mark the email as sent
          await updateSheet(
            row[0],
            row[1],
            row[2],
            data,
            `Sent by ${time} on ${day}, ${year}`
          );
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
};

cron.schedule(
  "*/5 * * * *",
  async () => {
    console.log("Keeping App Live Every 5 min");
    await axios
      .get("https://emailbirthdayautomation.onrender.com/keepAppAlive")
      .then((res) => console.log("This ran after 5 mins"))
      .catch((err) => console.log(err));
  },
  { scheduled: true }
);

cron.schedule(
  "0 9 * * *",
  async () => {
    const now = moment().tz("Africa/Lagos");
    console.log(
      ` [CRON] Email Schedule started to run at ${now.format(
        "YYYY-MM-DD HH:mm:ss"
      )}`
    );
    await checkBirthdaysAndSendEmails();
  },
  { scheduled: true, timezone: "Africa/Lagos" }
);

// const { time, day, year } = getSimpleTimeAndDay();
// const message = `Hello Olamide 😇, The Birthday Wish was sent at ${time} on ${day}, ${year} by the Email Automation Created by Odunsi Oluwabukola`

// sendWhatsAppNotification(message)
checkBirthdaysAndSendEmails();

app.listen(port, () => {
  console.log("App is listening on", port);
});
