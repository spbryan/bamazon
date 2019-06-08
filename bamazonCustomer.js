/***********************************************
 * Project: bamazon
 * Developer: Sean Bryan
 * Date: 2019-06-08
 ***********************************************/
var mysql = require("mysql");
var table = require("console.table");
var inquirer = require("inquirer");

/**
 * Create MySQL Database Connection
 */
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Edzumedzu*01",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    displayInventory();
    connection.end();
}

/**
 * Select items from the products table
 */
function displayInventory() {
    var tableValues = [];
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        for (var i = 0; i < response.length; i++) {
            tableValues.push(
                {
                    ID: response[i].item_id,
                    Name: response[i].product_name,
                    Price: "$" + response[i].price.toFixed(2)
                }
            )
        }
        console.table(tableValues);
    })
}