/***********************************************
 * Project: bamazon
 * Developer: Sean Bryan
 * Date: 2019-06-08
 ***********************************************/
var mysql = require("mysql");
var table = require("console.table");
var inquirer = require("inquirer");
var idList = [];
var tableValues = [];

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

/**
 * Starting point for the customer options
 */
function start() {
    idList = [];
    tableValues = [];
    inquirer
        .prompt([
            {
                name: "placeOrder",
                type: "confirm",
                message: "Would You Like to Place an Order?"
            }
        ])
        .then(function (answer) {
            if (answer.placeOrder) {
                connection.query("SELECT * FROM products", function (err, response) {
                    if (err) throw err;
                    displayInventory(response);
                    purchaseItem();
                })
            }
            else {
                connection.end();
            }
        });
}

/**
 * Select items from the products table
 */
function displayInventory(response) {
    for (var i = 0; i < response.length; i++) {
        idList.push(response[i].item_id.toString());
        tableValues.push(
            {
                ID: response[i].item_id,
                Name: response[i].product_name,
                Price: "$" + response[i].price.toFixed(2)
            }
        )
    }
    console.table(tableValues);
}

/** 
 * Accept console input to purchase a specific number of
 * items from the list
 */
function purchaseItem() {
    inquirer
        .prompt([
            {
                name: "itemID",
                type: "input",
                message: "Enter Item ID: ",
                validate: function (value) {
                    return validateItemID(value);
                }
            },
            {
                name: "orderQuantity",
                type: "input",
                message: "Enter Number of Units: ",
                validate: function (value) {
                    return validateQuantity(value);
                }
            }
        ])
        .then(function (answer) {
            verifyQuantity(answer.itemID, answer.orderQuantity);
        });
}

/**
 * Select item from the data base and verify that enough inventory is
 * available to meet the order
 * @param id 
 * @param quantity 
 */
function verifyQuantity(id, quantity) {
    connection.query("SELECT * FROM products WHERE item_id=?", [id], function (err, response) {
        if (err) throw err;
        var stockQuantity = parseInt(response[0].stock_quantity);
        var orderQuantity = parseInt(quantity);
        if (stockQuantity >= orderQuantity) {
            var newQuantity = stockQuantity - orderQuantity;
            var itemPrice = parseInt(response[0].price);
            var productSales = itemPrice * orderQuantity;
            console.log("Total Order Amount: $" + productSales);
            placeOrder(id, newQuantity, productSales);
        }
        else {
            console.log("Insufficient Quantity");
            purchaseItem();
        }
    })
}

/**
 * Update the data base with the correct values following a successful order
 * @param id 
 * @param newQuantity 
 * @param productSales 
 */
function placeOrder(id, newQuantity, productSales) {
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newQuantity,
                product_sales: productSales
            },
            {
                item_id: id
            }
        ], function (err, response) {
            if (err) throw err;
            console.log("Order Has Been Placed!");
            console.log("updated rows: " + response.affectedRows);
            start();
        })
}

/**
 * Validate the input from the ID List
 * @param value 
 */
function validateItemID(value) {
    if (idList.indexOf(value) > -1) {
        return true;
    }
    return "Invalid ID Value";
}

/**
 * Validate that the requested quatity is numeric 
 * and that there is enough in stock
 * @param value 
 */
function validateQuantity(value) {
    if (isNaN(value) === true) {
        return "Value Must Be Numeric";
    }
    return true;
}