const express = require("express");
const path = require("path");
const cocktailRoutes = require("./routes/cocktails");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", cocktailRoutes);

// catch anything that does not match a route above
app.use((req, res) => {
  res.status(404).render("error", { message: "That page does not exist." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
