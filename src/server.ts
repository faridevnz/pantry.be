import express from "express";
import * as process from "process";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

export type Food = {
  name: string;
  icon: string;
  expiration: string;
  category: string;
  quantity: {
    unit: string;
    value: string;
  };
};

// create the server instance
const app = express();
app.use(cors());

app.get("", (req, res) => {
  res.send("i'm up 🚀");
});

// register routes
app.get("/foods", (req, res) => {
  res.send([
    {
      name: "Broccoli Congelati",
      icon: "🥦",
      category: "VERDURA",
      expiration: "2023-06-12T15:39:12.726Z",
      quantity: { unit: "gr", value: "120" },
    },
    {
      name: "Avocado",
      icon: "🥑",
      category: "VERDURA",
      expiration: "2023-06-13T15:39:12.726Z",
      quantity: { unit: "gr", value: "60" },
    },
    {
      name: "Bistecchine di Vitello",
      icon: "🥩",
      category: "CARNE",
      expiration: "2023-06-14T15:39:12.726Z",
      quantity: { unit: "gr", value: "230" },
    },
    {
      name: "Sovraccosce di Pollo",
      icon: "🍗",
      category: "CARNE",
      expiration: "2023-06-10T15:39:12.726Z",
      quantity: { unit: "gr", value: "440" },
    },
    {
      name: "Mele rosse Fuji",
      icon: "🍎",
      category: "FRUTTA",
      expiration: "2023-06-11T15:39:12.726Z",
      quantity: { unit: "pz", value: "3" },
    },
    {
      name: "Pere",
      icon: "🍐",
      category: "FRUTTA",
      expiration: "2023-06-20T15:39:12.726Z",
      quantity: { unit: "pz", value: "1" },
    },
  ] satisfies Food[]);
});

// start the server
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Sever is running port ${PORT} ...`));
