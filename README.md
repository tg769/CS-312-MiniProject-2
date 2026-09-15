# CS 312 Mini Project 2 - Cocktail Finder

Web app for mini project 2. Built with Node, Express, EJS, and Axios.

You can search for a cocktail by name, browse by category, or just hit
"Surprise Me" for a random one. Clicking into a drink shows the picture,
ingredients/measurements, and instructions from TheCocktailDB. As a bonus
I also pulled in a second API (TheMealDB) so each recipe page suggests a
random food pairing too. Neither API needs a key.

If a search comes back empty or a request to the API fails, it shows an
error page instead of crashing, with a link back to try again.

## How to run it

```
npm install
npm start
```

then go to http://localhost:3000

## Files

- app.js - sets everything up
- routes/cocktails.js - the actual routes
- views/ - ejs pages
- public/css/style.css - styling
