/***********************************************
 * Project: bamazon
 * Developer: Sean Bryan
 * Date: 2019-06-11
 ***********************************************/
var mysql = require("mysql");
var table = require("console.table");
var inquirer = require("inquirer");
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
    var query = "SELECT v1.department_id, v1.department_name, v1.over_head_costs, SUM(v2.product_sales) AS product_sales "
    query += "FROM departments v1 ";
    query += "INNER JOIN products v2 ";
    query += "ON v1.department_name=v2.department_name ";
    query += "GROUP BY department_name";
    connection.query(query, function (err, response) {
        if (err) throw err;
        displayDepartmentsAndProducts(response);
        userOptions();
    })
}

/**
 * Select current details from the table
 */
function viewDepartments() {
    clearConsole();
    connection.query("SELECT * FROM departments", function (err, response) {
        if (err) throw err;
        displayDepartments(response);
        userOptions();
    })
}

/**
 * Add a new department category
 */
function createNewDepartment() {
    clearConsole();
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "Enter New Department Name:"
        }
    ]).then(function (answer) {
        addDepartment(answer.departmentName);
    });
}

/**
 * Close the data base connection
 */
function closeAndExit() {
    connection.end();
}

/**
 * Select items from the departments and products table
 */
function displayDepartmentsAndProducts(response) {
    tableValues = [];
    for (var i = 0; i < response.length; i++) {
        var totalProfits = response[i].product_sales - response[i].over_head_costs;
        tableValues.push(
            {
                Department_ID: response[i].department_id,
                Department_Name: response[i].department_name,
                Overhead_Costs: "$" + response[i].over_head_costs.toFixed(2),
                Product_Sales: "$" + response[i].product_sales.toFixed(2),
                Total_Profit: "$" + totalProfits.toFixed(2)
            }
        )
    }
    console.table(tableValues);
}

/**
 * Select items from the departments table
 */
function displayDepartments(response) {
    tableValues = [];
    for (var i = 0; i < response.length; i++) {
        tableValues.push(
            {
                Department_ID: response[i].department_id,
                Department_Name: response[i].department_name,
                Overhead_Costs: "$" + response[i].over_head_costs.toFixed(2)
            }
        )
    }
    console.table(tableValues);
}

/**
 * SQL to add a new department to departments table
 * @param department 
 */
function addDepartment(department) {
    connection.query("INSERT INTO departments SET ?",
        {
            department_name: department
        }
        , function (err, response) {
            if (err) throw err;
            clearConsole();
            console.log("Added New Department " + department);
            viewDepartments();
        })
}

/**
 * Clear the console
 */
function clearConsole() {
    process.stdout.write('\x1B[2J\x1B[0f');
}