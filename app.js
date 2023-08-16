const express = require("express");
const app = express();
const metode = require("./router/metodeRouter");
const productCat = require("./router/productCatRouter");
const product = require("./router/productRoute");
const cors = require("cors");
const sequilize = require("./models/sequelizeModel");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/views"));
app.use(cors());

app.get("/", (req, res) => {
  res.render("pembayaran");
});
app.get("/add", (req, res) => {
  fetch("http://127.0.0.1:3000/api/product", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      res.render("add", {
        users: data,
      });
    });
});
app.get("/product", (req, res) => {
  fetch("http://127.0.0.1:3000/api/product", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      res.render("product", {
        users: data,
      });
    });
});
app.get("/productCat", (req, res) => {
  res.render("productCat");
});

app.get("/edit/:id", (req, res) => {
  fetch("http://127.0.0.1:3000/api/product", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      res.render("edit_", {
        users: data,
      });
    });
});

app.post("/api/product/:id", async (req, res) => {
  const { product } = req.body;
  const { id } = req.params;
  console.log(id);
  try {
    // Update the data in the database
    const query = "UPDATE products SET product = $1 WHERE id = $2";
    await sequilize.query(query, {
      bind: [product, id],
      type: sequilize.QueryTypes.UPDATE,
    });

    // Redirect back to the page
    res.redirect("/product");
  } catch (error) {
    res.redirect("/product");
    console.log(error);
  }
});

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    // Delete the data from the database
    const query = "DELETE FROM products WHERE id = $1";
    await sequilize.query(query, {
      bind: [id],
      type: sequilize.QueryTypes.DELETE,
    });

    // Redirect back to the page
    res.redirect("/product");
  } catch (error) {
    console.error("Error deleting data:", error);
    res.redirect("/product");
  }
});

//router

app.use("/api/metodeBayar", metode);
app.use("/api/productCategory", productCat);
app.use("/api/product", product);

module.exports = app;
