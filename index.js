import express from "express";
import nodemailer from "nodemailer";
import cron from "node-cron"
import "dotenv/config";
import { readFiles, updateSheet } from "./googleSheet.js";
import axios from "axios";

const app = express();
const port = process.env.PORT;
// const html = `
// <h1>Dear ${name}</h1>
// <p>We wish you a wonderful birthday filled with joy and happiness! 🎉🎂\n\nBest regards,\nUMeRA Team</p>
// <img src='cid:unique@umera.ng' width='100%'/>
// `;

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "umera.ng",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

console.log(process.env.USER)
console.log(process.env.PASS)

app.use("/keepAppAlive", (req,res)=> {
  console.log("Keeping Server Alive")
  res.send('App is Alive')
})

app.use("/", (req,res)=> {
  console.log("Keeping Server Alive")
  res.send(`This is an App for Email Automation Using Googlesheet and Nodemailer by Odunsi Oluwabukola.
    All the thing wey i write for top na perspe, Make i no lie , Coding Hard die!
    `)
})


const sendBirthdayEmail = async (name, email) => {
  const mailOptions = {
    from: process.env.USER,
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
        filename: "HBD.png",
        path: "./images/HBD.png",
        cid: "unique@umera.ng",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Birthday email sent to: ${email}`);
  } catch (err) {
    console.error("Error sending email: ", err);
  }
};

const checkBirthdaysAndSendEmails = async () => {
  const data = await readFiles();
  const today = new Date().toISOString().slice(5, 10); // format MM-DD
  function getSimpleTimeAndDay() {
    const now = new Date();

    // Format time, day and year using toLocaleTimeString with options
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const year = now.getFullYear();

    return { time, day, year };
  }

  const { time, day, year } = getSimpleTimeAndDay();
  console.log(`Current time: ${time}`);
  console.log(`Today is: ${day}`);

  console.log(today);
  console.log(data);

  for (let row of data) {
    const name = row[0];
    const email = row[1];
    const birthday = row[2];
    const sent = row[3];

    console.log(name);
    console.log(email);
    console.log(birthday);
    try {
      if (birthday.slice(5, 10) === today && !sent) {
        try {
          await sendBirthdayEmail(name, email);
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
  "0 9 * * *", async () => {
    console.log('Email Schedule started to run')
    await checkBirthdaysAndSendEmails();
  }
)



  cron.schedule(
    "*/5 * * * *", async () => {
      console.log('Keeping App Live Every 5 min')
        await axios.get('https://emailbirthdayautomation.onrender.com/keepAppAlive')
        .then((res) => console.log('This ran after 5 mins'))
        .catch(err => console.log(err))
    }
  )


// checkBirthdaysAndSendEmails()




app.listen(port, () => {
  console.log("App is listening on", port);
});
