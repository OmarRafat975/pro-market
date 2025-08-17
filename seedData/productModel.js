const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');


const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
