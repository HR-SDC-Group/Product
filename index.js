const express = require('express');
const compression = require('compression');
const cache = require("./routeCache.js");
const app = express();
const pool = require("./db")


app.use(express.json());
app.use(compression({
  threshhold: 0
}));

//Routes

//get product
app.get('/products/:product_id', cache(300), (req, res) => {
  // res.send('Hello from the server!');
  pool.getOne(req.params.product_id, function(err, results) {
    if (err) { throw err; }
    res.send(results.rows);
  });
});

//get styles
app.get('/products/:product_id/styles', cache(300), (req, res) => {
  pool.getStyles(req.params.product_id, function(err, results) {
    if (err) { throw err; }
    res.json(results.rows);
  });
});

//get related
app.get('/products/:product_id/related', cache(300), (req, res) => {
  pool.getRelated(req.params.product_id, function(err, results) {
    if (err) { throw err; }
    res.json(results.rows);
  });
});

//get cart
app.get('/cart', cache(300), (req, res) => {
  pool.getCart(function(err, results) {
    if (err) { throw err; }
    res.json(results.rows);
  });
});

//post
app.post('/cart', (req, res) => {

  pool.postCart(req.body.product_id, function(err, results) {
    if (err) { throw err; }
    res.send('posted');
  });
});


app.listen(3000, () => {
  console.log('♥️ server is listening on port 3000 ♥️')
});