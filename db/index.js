const Pool = require("pg").Pool;
const DB_PSW = require('../config.js');

const pool = new Pool({
  user: "postgres",
  password: DB_PS,
  database: "sdc",
  host: "54.241.119.32",
  port: 5432
});

const getOne = function (param, callback) {

  var queryStr = `SELECT *,(SELECT json_agg(json_build_object('feature', features.feature, 'value', features.value))
  FROM features WHERE features.product_id= products.id) AS features
  FROM products
  WHERE products.product_id = ${param}
  ORDER BY products.id`;

  pool.query(queryStr, function(err, results) {
    if (err) { callback(err, null); }
    callback(null, results);
  });
};

const getStyles = function (param, callback) {
  var subQuery = `SELECT json_agg(json_build_object('thumbnail_url', photos.thumbnail_url, 'url', photos.url)) FROM photos WHERE photos.style_id=styles.id`;
  var queryStr = `SELECT styles.product_id, json_agg(json_build_object
    ('style_id', styles.id, 'name', styles.name, 'original_price', styles.original_price,
    'sale_price', styles.sale_price)) AS results, ${subQuery} AS photos
  FROM styles
  WHERE styles.product_id = ${param}
  ORDER BY styles.product_id`;
  pool.query(queryStr, function(err, results) {
    if (err) { callback(err, null); }
    callback(null, results);
  });
};

const getRelated = function (param, callback) {
  var queryStr = `select * from related where product_id = ${param}
  ORDER BY id DESC LIMIT 10`;
  pool.query(queryStr, function(err, results) {
    if (err) { callback(err, null); }
    callback(null, results);
  });
};

const getCart= function (callback) {
  var queryStr = `select * from cart ORDER BY id DESC`;
  pool.query(queryStr, function(err, results) {
    if (err) { callback(err, null); }
    callback(null, results);
  });
};

const postCart= function(param, callback) {
  var queryStr = `INSERT INTO cart(product_id) SELECT id
  FROM products WHERE product_id = ${param}`;
  pool.query(queryStr, function(err, results) {
    if (err) { callback(err, null); }
    callback(null, results);
  });
};

module.exports = {
  pool: pool,
  getOne: getOne,
  getStyles: getStyles,
  getRelated: getRelated,
  getCart: getCart,
  postCart: postCart
  };
