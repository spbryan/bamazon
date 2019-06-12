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

/**
 * Select current details from the table
 */
function viewProducts() {
    clearConsole();
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        displayInventory(response);
        userOptions();
    })
}

/**
 * Select product details where inventory is below a set value
 */
function viewLowInventory() {
    clearConsole();
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, response) {
        if (err) throw err;
        displayInventory(response);
        userOptions();
    })
}

/**
 * Update the quantity of a specified inventory item
 */
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

/**
 * Add a new item to the inventory
 */
function addNewProduct() {
    clearConsole();
    connection.query("SELECT DISTINCT department_name FROM departments", function (err, response) {
        if (err) throw err;
        var departments = [];

        for (var i = 0; i < response.length; i++) {
            departments.push(response[i].department_name);
        }

        inquirer.prompt([
            {
                type: "input",
                name: "productName",
                message: "Enter Name of Product:"
            },
            {
                type: "list",
                name: "department",
                message: "Select Product Department:",
                choices: departments
            },
            {
                type: "input",
                name: "price",
                message: "Enter Price Per Unit:",
                validate: function (value) {
                    return validateIsNumeric(value);
                }
            },
            {
                type: "input",
                name: "count",
                message: "Enter Number of Units:",
                validate: function (value) {
                    return validateIsNumeric(value);
                }
            }
        ]).then(function (answer) {
            addProduct(answer.productName, answer.department,
                parseFloat(answer.price), parseInt(answer.count));
        });
    })
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