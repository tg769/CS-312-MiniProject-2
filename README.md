# CS 312 Mini Project 2 - Cocktail Finder

A small Node.js/Express web app that lets a user look up cocktail recipes using
the public TheCocktailDB API. Built with Express, EJS, and Axios.

## Features

- Search for a cocktail by name
- Browse cocktails by category (dropdown is filled in from the API)
- Get a random cocktail recipe
- Recipe page shows the image, ingredients with measurements, and instructions
- Each recipe page also shows a random food pairing suggestion pulled from a
  second API, TheMealDB
- Errors (bad search, no results, API request failing) show a message and let
  the user go back and try again

## APIs used

- [TheCocktailDB](https://www.thecocktaildb.com/api.php) - main data source for cocktails
- [TheMealDB](https://www.themealdb.com/api.php) - second API, used for the food pairing suggestion on the recipe page

Both are free and do not require signing up for a personal key.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Start the server:

   ```
   npm start
   ```

3. Open `http://localhost:3000` in your browser.

## Project structure

```
app.js              entry point, sets up express and routes
routes/cocktails.js  all the routes (search, category, random, recipe page)
views/               ejs templates
public/css/          stylesheet
```
