/***********************************************
 * Project: bamazon
 * Developer: Sean Bryan
 * Date: 2019-06-10
 ***********************************************/
var mysql = require("mysql");
var table = require("console.table");
var inquirer = require("inquirer");
// var idList = [];
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
    userOptions();
});

/**
 * Starting point for the manager options
 */
function userOptions() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "managerSelection",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
            }
        ])
        .then(function (answer) {
            switch (answer.managerSelection) {
                case 'View Products for Sale':
                    viewProducts();
                    break;
                case 'View Low Inventory':
                    viewLowInventory();
                    break;
                case 'Add to Inventory':
                    addToInventory();
                    break;
                case 'Add New Product':
                    addNewProduct();
                    break;
                default:
                    closeAndExit();
            }
        });
}

function viewProducts() {
    clearConsole();
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        displayInventory(response);
        userOptions();
    })
}

function viewLowInventory() {
    clearConsole();
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, response) {
        if (err) throw err;
        displayInventory(response);
        userOptions();
    })
}

function addToInventory() {
    clearConsole();
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter ID for Product:",
            validate: function (value) {
                return validateIsNumeric(value);
            }
        },
        {
            type: "input",
            name: "addUnits",
            message: "Enter Number of Additional Units:",
            validate: function (value) {
                return validateIsNumeric(value);
            }
        }
    ]).then(function (answer) {
        updateQuantity(parseInt(answer.itemID), parseInt(answer.addUnits));
    });
}

function addNewProduct() {
    console.log("Inside addNewProduct");
    connection.end();
}

function closeAndExit() {
    console.log("Inside closeAndExit");
    connection.end();
}

/**
 * Select items from the products table
 */
function displayInventory(response) {
    tableValues = [];
    for (var i = 0; i < response.length; i++) {
        tableValues.push(
            {
                ID: response[i].item_id,
                Name: response[i].product_name,
                Price: "$" + response[i].price.toFixed(2),
                Quantity: response[i].stock_quantity
            }
        )
    }
    console.table(tableValues);
}

function updateQuantity(id, addUnits) {
    connection.query("SELECT * FROM products WHERE item_id=?", [id], function (err, response) {
        if (err) throw err;
        var name = response[0].product_name;
        var currentQuantity = parseInt(response[0].stock_quantity);
        var newQuantity = currentQuantity + addUnits;
        connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newQuantity
                },
                {
                    item_id: id
                }
            ], function (err, response) {
                if (err) throw err;
                clearConsole();
                consoleMessage("Number of " + name + " in stock raised from " +
                    currentQuantity + " to " + newQuantity);
                userOptions();
            })

    })
}

function clearConsole() {
    process.stdout.write('\x1B[2J\x1B[0f');
}

function consoleMessage(message) {
    console.log("  ");
    console.log("+----------------------------------------------------------+");
    console.log(message);
    console.log("+----------------------------------------------------------+");
    console.log("  ");
}

/**
 * Validate that the requested value is numeric
 * @param value 
 */
function validateIsNumeric(value) {
    if (isNaN(value) === true) {
        return "Value Must Be Numeric";
    }
    return true;
}