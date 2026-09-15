const express = require("express");
const axios = require("axios");

const router = express.Router();

const COCKTAIL_API = "https://www.thecocktaildb.com/api/json/v1/1";
const MEAL_API = "https://www.themealdb.com/api/json/v1/1";

// home page, has the search form, the category dropdown, and the random button
router.get("/", async (req, res) => {
  try {
    const categoryRes = await axios.get(`${COCKTAIL_API}/list.php?c=list`);
    res.render("index", { categories: categoryRes.data.drinks });
  } catch (err) {
    console.log("Error loading categories:", err.message);
    res.render("index", { categories: [] });
  }
});

// search for a cocktail by name
router.get("/search", async (req, res) => {
  const name = req.query.name;

  if (!name || !name.trim()) {
    return res.render("error", { message: "Please enter a cocktail name to search for." });
  }

  try {
    const result = await axios.get(`${COCKTAIL_API}/search.php`, {
      params: { s: name }
    });
    const drinks = result.data.drinks;

    if (!drinks) {
      return res.render("error", {
        message: `No cocktails found for "${name}". Try a different name.`
      });
    }

    res.render("list", { drinks: drinks, heading: `Results for "${name}"` });
  } catch (err) {
    console.log("Error searching cocktails:", err.message);
    res.render("error", { message: "Something went wrong while searching. Please try again." });
  }
});

// browse cocktails by category (bonus feature)
router.get("/category", async (req, res) => {
  const category = req.query.name;

  if (!category) {
    return res.render("error", { message: "Please pick a category first." });
  }

  try {
    const result = await axios.get(`${COCKTAIL_API}/filter.php`, {
      params: { c: category }
    });
    const drinks = result.data.drinks;

    if (!drinks) {
      return res.render("error", { message: `No cocktails found in the ${category} category.` });
    }

    res.render("list", { drinks: drinks, heading: `Category: ${category}` });
  } catch (err) {
    console.log("Error loading category:", err.message);
    res.render("error", { message: "Something went wrong while loading that category. Please try again." });
  }
});

// grab a random cocktail and send the user to its recipe page
router.get("/random", async (req, res) => {
  try {
    const result = await axios.get(`${COCKTAIL_API}/random.php`);
    const drink = result.data.drinks[0];
    res.redirect(`/cocktail/${drink.idDrink}`);
  } catch (err) {
    console.log("Error getting random cocktail:", err.message);
    res.render("error", { message: "Could not get a random cocktail right now. Please try again." });
  }
});

// full recipe page for one cocktail
router.get("/cocktail/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await axios.get(`${COCKTAIL_API}/lookup.php`, {
      params: { i: id }
    });
    const drink = result.data.drinks ? result.data.drinks[0] : null;

    if (!drink) {
      return res.render("error", { message: "That cocktail could not be found." });
    }

    // the api gives ingredients/measures as strIngredient1..15 and strMeasure1..15
    // instead of dealing with that in the view, turn it into a normal array here
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink["strIngredient" + i];
      const measure = drink["strMeasure" + i];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient,
          measure: measure ? measure.trim() : ""
        });
      }
    }

    // second api (bonus) - suggest a random food pairing from TheMealDB
    let meal = null;
    try {
      const mealResult = await axios.get(`${MEAL_API}/random.php`);
      meal = mealResult.data.meals[0];
    } catch (mealErr) {
      console.log("Could not load a food pairing:", mealErr.message);
    }

    res.render("cocktail", { drink: drink, ingredients: ingredients, meal: meal });
  } catch (err) {
    console.log("Error loading cocktail:", err.message);
    res.render("error", { message: "Something went wrong while loading that cocktail. Please try again." });
  }
});

module.exports = router;
