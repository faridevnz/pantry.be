import express, { json } from "express";
import * as process from "process";
import * as dotenv from "dotenv";
import cors from "cors";
import {
  PrismaClient,
  QuantityType,
  RecipeDifficulty,
  Recipe as RecipeEntity,
} from "@prisma/client";
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
export type Recipe = {
  name: string;
  description: string;
  difficulty: "FACILE" | "DIFFICILE" | "MEDIO";
  category: string;
  time: number;
  nutritional_values: {
    calories: number;
    fats: number;
    carbohydrates: number;
    proteins: number;
  };
  food: {
    all: {
      count: number;
    };
    missing: {
      count: number;
    };
  };
};

// create the server instance
const app = express();
app.use(cors());
app.use(json());

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

type CreateFoodDTO = {
  name: string;
  category: string;
  icon: string;
  quantity: { unit: "GR" | "ML" | "PZ"; value: string };
  calories: string;
  proteins: string;
  carbohydrates: string;
  fats: string;
  expiration: string;
};
const mapQuantityType = (
  type: CreateFoodDTO["quantity"]["unit"]
): QuantityType => {
  return type === "GR" ? "MG" : type;
};
app.post("/foods", async (req, res) => {
  const body: CreateFoodDTO = req.body;
  const created = await prisma.food.create({
    data: {
      name: body.name,
      icon: body.icon,
      quantity_type: mapQuantityType(body.quantity.unit),
      quantity_value:
        body.quantity.unit === "GR"
          ? Number(body.quantity.value) * 1000
          : Number(body.quantity.value),
      carbohydrate: Number(body.carbohydrates),
      protein: Number(body.proteins),
      fat: Number(body.fats),
      expiration: body.expiration,
      food_category: {
        connectOrCreate: {
          where: {
            name: body.category,
          },
          create: {
            name: body.category,
          },
        },
      },
    },
  });
  res.send({ ...created });
});

app.get("/recipes", async (req, res) => {
  // get recipes from db
  const recipes = await prisma.recipe.findMany({
    include: { Recipe_Food: { include: { food: true, recipe: true } } },
  });
  // map data
  const mapped: Recipe[] = recipes.map((recipe) => {
    // compute macros
    const carbo = recipe.Recipe_Food.reduce((acc, food_in_recipe) => {
      return (
        (food_in_recipe.food.carbohydrate / 100) * food_in_recipe.quantity * 4 +
        acc
      );
    }, 0);
    const protein = recipe.Recipe_Food.reduce((acc, food_in_recipe) => {
      return (
        (food_in_recipe.food.protein / 100) * food_in_recipe.quantity * 4 + acc
      );
    }, 0);
    const fat = recipe.Recipe_Food.reduce((acc, food_in_recipe) => {
      return (
        (food_in_recipe.food.fat / 100) * food_in_recipe.quantity * 4 + acc
      );
    }, 0);
    return {
      name: recipe.name,
      time: recipe.time,
      nutritional_values: {
        calories: carbo + protein + fat,
        carbohydrates: Math.abs(carbo / 4),
        fats: Math.abs(fat / 9),
        proteins: Math.abs(protein / 4),
      },
      food: {
        all: { count: 0 },
        missing: { count: 0 },
      },
      category: "",
      description: recipe.description,
      difficulty: recipe.difficulty,
    };
  });
  // return data
  res.send(mapped);
});

// start the server
const PORT = process.env.PORT || 3333;
app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Sever is running port ${PORT} ...`);
});
