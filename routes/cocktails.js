const express = require("express");
const axios = require("axios");

const router = express.Router();

const COCKTAIL_API = "https://www.thecocktaildb.com/api/json/v1/1";
const MEAL_API = "https://www.themealdb.com/api/json/v1/1";

// home page - search box, category dropdown, random button
router.get("/", async (req, res) => {
  try {
    const categoryRes = await axios.get(`${COCKTAIL_API}/list.php?c=list`);
    res.render("index", { categories: categoryRes.data.drinks });
  } catch (err) {
    console.log(err);
    res.render("index", { categories: [] });
  }
});

router.get("/search", async (req, res) => {
  const name = req.query.name;

  if (!name || !name.trim()) {
    return res.render("error", { message: "Type something in before searching." });
  }

  try {
    const result = await axios.get(`${COCKTAIL_API}/search.php`, {
      params: { s: name }
    });
    const drinks = result.data.drinks;

    if (!drinks) {
      return res.render("error", {
        message: `Couldn't find anything for "${name}". Try a different name.`
      });
    }

    res.render("list", { drinks: drinks, heading: `Results for "${name}"` });
  } catch (err) {
    console.log(err);
    res.render("error", { message: "The search request failed, try again in a bit." });
  }
});

// browse by category - dropdown on the home page is filled from list.php?c=list
router.get("/category", async (req, res) => {
  const category = req.query.name;

  if (!category) {
    return res.render("error", { message: "Pick a category first." });
  }

  try {
    const result = await axios.get(`${COCKTAIL_API}/filter.php`, {
      params: { c: category }
    });
    const drinks = result.data.drinks;

    if (!drinks) {
      return res.render("error", { message: `Nothing found in the ${category} category.` });
    }

    res.render("list", { drinks: drinks, heading: `Category: ${category}` });
  } catch (err) {
    console.log(err);
    res.render("error", { message: "That category request failed, try again in a bit." });
  }
});

router.get("/random", async (req, res) => {
  try {
    const result = await axios.get(`${COCKTAIL_API}/random.php`);
    const drink = result.data.drinks[0];
    res.redirect("/cocktail/" + drink.idDrink);
  } catch (err) {
    console.log(err);
    res.render("error", { message: "Couldn't get a random cocktail, try again." });
  }
});

router.get("/cocktail/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await axios.get(`${COCKTAIL_API}/lookup.php`, {
      params: { i: id }
    });
    const drink = result.data.drinks ? result.data.drinks[0] : null;

    if (!drink) {
      return res.render("error", { message: "Couldn't find that cocktail." });
    }

    // api returns ingredients/measures as strIngredient1, strMeasure1, strIngredient2, etc
    // up to 15, most are blank so only keep the ones that actually have something
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink["strIngredient" + i];
      const measure = drink["strMeasure" + i];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({
          ingredient: ingredient,
          measure: measure ? measure.trim() : ""
        });
      }
    }

    // pulling in a second api here for the bonus part, grabs a random meal
    // to show as a "pairs well with" suggestion under the drink
    let meal = null;
    try {
      const mealResult = await axios.get(MEAL_API + "/random.php");
      meal = mealResult.data.meals[0];
    } catch (mealErr) {
      console.log(mealErr);
    }

    res.render("cocktail", { drink: drink, ingredients: ingredients, meal: meal });
  } catch (err) {
    console.log(err);
    res.render("error", { message: "That cocktail request failed, try again." });
  }
});

module.exports = router;
