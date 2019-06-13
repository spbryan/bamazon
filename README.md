# bamazon
## Application Description
_An "amazon" like application that interacts with with a MySQL data base to interact with product inventory from the perspective of a Customer, Manager, or Supervisor.  Current functionality includes features to view and manipulate details on products and departments MySQL tables._

## Application Organization
The application is organized with separate js files defined for each perspective:
* __bamazonCustomer.js__ - Receives command input to select and order from a list of available products interacting with the products MySQL table.
* __bamazonManager.js__ - Receives command input to view and augment available products interacting with the products MySQL table.
* __bamazonSupervisor.js__ - Receives command input to view and augment available products interacting with both the departments and products MySQL tables.

## Running the Application
To run this application use the command line:

__Customer View__

node bamazonCustomer.js
* Select Y to place an order
* Enter an Item ID from the displayed list of products
* Enter the number of units.  If there is enough inventory the order will be placed
* Select Y/N to place another order

__Manager View__

node bamazonManager.js
* View Products For Sale - Display the current inventory from the products table
* View Low Inventory - Display a list of products with a count less than 5 in the products table
* Add to Inventory - Order more inventory for a given item (input Item ID followed by unit quantity)
* Add New Product - Add a new product entry to the product table
    - Enter Product Name
    - Select from the list of departments
    - Enter the price per unit
    - Enter the number of units
* Exit

__Supervisor View__

node bamazonSupervisor.js
* View Product Sales By Department - Display current sales and profits for all departments
* Create New Department - Create new department entry (will expose new entry in Manager View for ordering products)
* Exit

## Technology
This application was written in JavaScript on NodeJs. 

__NPM Installs__
* console.table: ^0.10.0
* inquirer: ^6.3.1
* mysql: ^2.17.1

## Development Role
Application designed and developed by Sean Bryan as part of a homework assignment for the UNH Full Stack Boot Camp.
