const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./productModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DB_URI;

mongoose.connect(DB).then(() => console.log("DB Connection is Successful!"));

const products = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, "utf-8"));

const importData = async () => {
  try {
    await Product.create(products, { validateBeforeSave: false });

    console.log("Data imported Successfuly");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();

    console.log("Data removed Successfuly");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
