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
  id: string;
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
  difficulty: "F" | "D" | "M";
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
      id: food.id,
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

app.delete("/foods/:id", async (req, res) => {
  const id = req.params["id"];
  // delete food
  const deleted = await prisma.food.delete({ where: { id } });
  console.log(deleted);
  // return
  res.send({ ...deleted });
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
    include: {
      Recipe_Food: { include: { food: true, recipe: true } },
      RecipeCategory: true,
    },
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
        calories: Math.floor(carbo + protein + fat),
        carbohydrates: Math.floor(carbo / 4),
        fats: Math.floor(fat / 9),
        proteins: Math.floor(protein / 4),
      },
      food: {
        all: { count: 0 },
        missing: { count: 0 },
      },
      category: recipe.RecipeCategory.name,
      description: recipe.description,
      difficulty: recipe.difficulty,
    };
  });
  // return data
  res.send(mapped);
});

type IngredientDTO = {
  food_id: string;
  quantity: string;
};
type CreateRecipeDTO = {
  name: string;
  description: string;
  category: string;
  difficulty: "F" | "M" | "D";
  time: string;
  ingredients: IngredientDTO[];
};
app.post("/recipes", async (req, res) => {
  const body: CreateRecipeDTO = req.body;
  const created = await prisma.recipe.create({
    data: {
      name: body.name,
      description: body.description,
      process: null,
      difficulty: body.difficulty,
      time: Number(body.time),
      Recipe_Food: {
        createMany: {
          data: body.ingredients.map((ingredient) => ({
            foodId: ingredient.food_id,
            quantity: Number(ingredient.quantity),
          })),
        },
      },
      RecipeCategory: {
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
    include: {
      Recipe_Food: true,
    },
  });
  // return
  res.send({ ...created });
});

// start the server
const PORT = process.env.PORT || 3333;
app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Sever is running port ${PORT} ...`);
});
