/***********************************************
 * Project: bamazon
 * Developer: Sean Bryan
 * Date: 2019-06-11
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
                name: "selection",
                message: "What would you like to do?",
                choices: ["View Products Sales By Department", "Create New Department", "Exit"]
            }
        ])
        .then(function (answer) {
            switch (answer.selection) {
                case 'View Products Sales By Department':
                    viewProductsSalesByDepartment();
                    break;
                case 'Create New Department':
                    createNewDepartment();
                    break;
                default:
                    closeAndExit();
            }
        });
}

/**
 * Select current details from the table
 */
function viewProductsSalesByDepartment() {
    clearConsole();
    // connection.query("SELECT * FROM products", function (err, response) {
    //     if (err) throw err;
    //     displayInventory(response);
    //     userOptions();
    // })
}

/**
 * Add a new item to the inventory
 */
function createNewDepartment() {
    clearConsole();
    // inquirer.prompt([
    //     {
    //         type: "input",
    //         name: "productName",
    //         message: "Enter Name of Product:"
    //     },
    //     {
    //         type: "input",
    //         name: "department",
    //         message: "Enter Product Department:"
    //     },
    //     {
    //         type: "input",
    //         name: "price",
    //         message: "Enter Price Per Unit:",
    //         validate: function (value) {
    //             return validateIsNumeric(value);
    //         }
    //     },
    //     {
    //         type: "input",
    //         name: "count",
    //         message: "Enter Number of Units:",
    //         validate: function (value) {
    //             return validateIsNumeric(value);
    //         }
    //     }
    // ]).then(function (answer) {
    //     addProduct(answer.productName, answer.department,
    //         parseFloat(answer.price), parseInt(answer.count));
    // });
}

/**
 * Close the data base connection
 */
function closeAndExit() {
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

/**
 * SQL to update the stock quantity of the products table
 * @param id 
 * @param addUnits 
 */
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

/**
 * SQL to add a new item to the inventory
 * @param name 
 * @param department 
 * @param price 
 * @param count 
 */
function addProduct(name, department, price, count) {
    connection.query("INSERT INTO products SET ?",
        {
            product_name: name,
            department_name: department,
            price: price,
            stock_quantity: count
        }
        , function (err, response) {
            if (err) throw err;
            clearConsole();
            consoleMessage("Added new item to Inventory");
            displayEntry(name, department, price, count);
            userOptions();
        })
}

/**
 * Display an inventory item
 * @param name 
 * @param department 
 * @param price 
 * @param quantity 
 */
function displayEntry(name, department, price, quantity) {
    tableValues = [];
    tableValues.push(
        {
            ID: name,
            Name: department,
            Price: "$" + price.toFixed(2),
            Quantity: quantity
        }
    )
    console.table(tableValues);
}

/**
 * Clear the console
 */
function clearConsole() {
    process.stdout.write('\x1B[2J\x1B[0f');
}

/**
 * Format a console message
 * @param message 
 */
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