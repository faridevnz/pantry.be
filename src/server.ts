import express from "express";
import * as process from "process";
import * as dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

dotenv.config();

export type Food = {
  name: string;
  icon: string;
  expiration: string;
  category: string;
  quantity: {
    unit: string;
    value: number;
  };
};

// create the server instance
const app = express();
app.use(cors());

app.get("", (req, res) => {
  res.send("i'm up 🚀");
});

// register routes
app.get("/foods", async (req, res) => {
  // get foods from db
  const foods = await prisma.food.findMany({
    include: { food_category: true },
  });
  // map data
  const mapped: Food[] = foods.map((food) => {
    return {
      name: food.name,
      icon: food.icon,
      category: food.food_category.name,
      expiration: food.expiration,
      quantity: {
        unit: food.quantity_type,
        value: food.quantity_value,
      },
    };
  });
  // return mapped foods
  res.send(mapped);
});

// start the server
const PORT = process.env.PORT || 3333;
app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Sever is running port ${PORT} ...`);
});
