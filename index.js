require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(formidable());

const api_key = process.env.API_KEY;
const domain = process.env.DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.get("/", (req, res) => {
  res.send("server is up");
});

app.post("/form", (req, res) => {
  console.log(req.fields);

  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: "emilie.leury@gmail.com",
    subject: "Formulaire JS",
    text: req.fields.message,
  };

  mailgun.messages().send(data, (error, body) => {
    if (error === undefined) {
      res.json({ message: "Données du form bien reçues, mail envoyé" });
    } else {
      res.json(error);
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log("server is listening");
});
