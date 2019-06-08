/***********************************************
 * Project: bamazon
 * Developer: Sean Bryan
 * Date: 2019-06-08
 ***********************************************/
var mysql = require("mysql");
var table = require("console.table");
var inquirer = require("inquirer");
var idList = [];

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
    idList = [];
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        displayInventory(response);
        purchaseItem();
    })

    connection.end();
}

/**
 * Select items from the products table
 */
function displayInventory(response) {
    var tableValues = [];
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
                    return isNumeric(value);
                }
            }
        ])
        .then(function (answer) {
            console.log(answer.itemID);
            console.log(answer.orderQuantity);
            // when finished prompting, insert a new item into the db with that info
            // connection.query(
            //     "INSERT INTO auctions SET ?",
            //     {
            //         item_name: answer.item,
            //         category: answer.category,
            //         starting_bid: answer.startingBid || 0,
            //         highest_bid: answer.startingBid || 0
            //     },
            //     function (err) {
            //         if (err) throw err;
            //         console.log("Your auction was created successfully!");
            //         // re-prompt the user for if they want to bid or post
            //         start();
            //     }
            // );
        });

    /**
     * Validate the input from the ID List
     * @param value 
     */
    function validateItemID(value) {
        if (idList.indexOf(value) > 0) {
            return true;
        }
        return "Invalid ID Value";
    }

    /**
     * Validate is Numeric
     * @param value 
     */
    function isNumeric(value) {
        if (isNaN(value) === false) {
            return true;
        }
        return "Value Must Be Numeric";
    }
}