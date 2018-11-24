// Create a new Node application called bamazonManager.js. Running this application will:

// List a set of menu options:

// View Products for Sale

// View Low Inventory

// Add to Inventory

// Add New Product

const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "appTest",
    password: "appTest01",
    database: "bamazondb"
});

function startMenu() {
    inquirer.prompt({
        name: "menuItem",
        type: "rawlist",
        message: "Select the menu option you would like to do.",
        choices: ["View Products for Sale", "View Low Inventory","Add to Inventory","Add New Product","Exit"]
      })
      .then(function (answer) {
        // based on their answer, call the corresponding functions
        if (answer.menuItem === "View Products for Sale") {
            viewInventory();
        } else if (answer.menuItem === "View Low Inventory") {
            lowInventory();
        } else if (answer.menuItem === "Add to Inventory") {
            addInventory();
        } else if (answer.menuItem === "Add New Product") {
            newInventory();
        } else if (answer.menuItem === "Exit") {
            exit();
        }
    });
}

connection.connect(function (err) {
    if (err) {
        throw err;
    };
    // run the startMenu function after the connection is made to prompt the user
    startMenu();
});

// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

function viewInventory () {
    connection.query("SELECT item_id, department_name, product_name,        CONCAT('$',FORMAT(price,2)) AS price, stock_quantity FROM products",
    function(err, data) {
        if (err) {
            throw err;
        };
        console.table('\nInventory',data)
        inquirer.prompt({
            name: "menuItem",
            type: "rawlist",
            message: "Select the menu option you would like to do.",
            choices: ["View Low Inventory","Add to Inventory","Add New Product","Exit"]
        })
        .then(function (answer) {
            // based on their answer, call the corresponding functions
            if (answer.menuItem === "View Low Inventory") {
                lowInventory();
            } else if (answer.menuItem === "Add to Inventory") {
                addInventory();
            } else if (answer.menuItem === "Add New Product") {
                newInventory();
            } else if (answer.menuItem === "Exit") {
                exit();
            }
        });
    })
};

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function lowInventory () {
    connection.query("SELECT item_id, department_name, product_name,        CONCAT('$',FORMAT(price,2)) AS price, stock_quantity FROM products WHERE stock_quantity < 5",
    function(err, data) {
        if (err) {
            throw err;
        };
        console.table('\nLow Inventory',data)
        inquirer.prompt({
            name: "menuItem",
            type: "rawlist",
            message: "Select the menu option you would like to do.",
            choices: ["View Products for Sale","Add to Inventory","Add New Product","Exit"]
        })
        .then(function (answer) {
            // based on their answer, call the corresponding functions
            if (answer.menuItem === "View Products for Sale") {
                viewInventory();
            } else if (answer.menuItem === "Add to Inventory") {
                addInventory();
            } else if (answer.menuItem === "Add New Product") {
                newInventory();
            } else if (answer.menuItem === "Exit") {
                exit();
            }
        });
    })
};

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory () {
    connection.query("SELECT item_id, department_name, product_name,        CONCAT('$',FORMAT(price,2)) AS price, stock_quantity FROM products",
    function(err, data) {
            if (err) {
                throw err;
            };
            choiceArray = [];
            data.forEach(function (item) {
                var choice = new ChoiceOption (item.product_name, item.item_id);
                choiceArray.push(choice);
            });
            console.table('\nCurrent Inventory',data)   
            inquirer.prompt([
                {
                type: "list",
                name: "item",
                message: "Select the item to which you want to add inventory.",
                choices: choiceArray
              },
              {
                type: 'input',
                name: 'quantity',
                message: 'How many units of that item do you want to add?',
                validate: function(value) {
                  var valid = !isNaN(parseInt(value));
                  return valid || 'Please enter a number';
                },
                filter: Number
              }
            ])
            .then(answers => {
                //console.log(JSON.stringify(answers, null,' '));
                connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
                [answers.quantity,answers.item],
                (err, data) => {
                    if (err) {
                        throw err;
                    };
                    connection.query("SELECT item_id, department_name, product_name, CONCAT('$',FORMAT(price,2)) AS price, stock_quantity FROM products WHERE item_id = ?",
                    [answers.item],
                    (err, data) => {
                        if (err) {
                            throw err;
                        };
                        console.table('\nUpdated Inventory',data)
                        startMenu();
                    })
                })
            })
        })
    };

function ChoiceOption (name, value) {
    this.name = name;
    this.value = value;
};

// // If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function newInventory() {
    inquirer.prompt([
        {                
            type: 'input',
            name: 'department',
            message: "What is the department name of the new product?",
            filter: function (str) {
                str = str.toLowerCase()
                         .split(' ') 
                         .map(function(word) {
                            return word.replace(word[0], word[0].toUpperCase());
                         })
                return str.join(" ");
            }
        },
        {
            type: 'input',
            name: 'product',
            message: "What is the product name?",
            filter: function (str) {
                str = str.toLowerCase()
                         .split(' ') 
                         .map(function(word) {
                            return word.replace(word[0], word[0].toUpperCase());
                         })
                return str.join(" ");
            }
        },
        {
            type: 'input',
            name: 'price',
            message: 'What is the price of the new product?',
            filter: function(val) {
                return parseFloat(val);
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many units are there of the new product?',
            filter: function(val) {
                return parseInt(val);
            }
        }]
        ).then(answers => {
            connection.query("INSERT INTO products SET ?",
            [{
                department_name: answers.department, 
                product_name: answers.product, 
                price: answers.price,
                stock_quantity: answers.quantity
            }],
            function(err, data) {
                if (err) {
                    throw err;
                };
                console.log(data);
                connection.query("SELECT item_id, department_name, product_name, CONCAT('$',FORMAT(price,2)) AS price, stock_quantity FROM products WHERE item_id = ?",
                [data.insertId],
                (err, data) => {
                    if (err) {
                        throw err;
                    };
                    console.table('\nAdded Inventory',data)
                    inquirer.prompt(
                        {
                            type: 'confirm',
                            name: 'addAnother',
                            message: 'Do you want to add another new product?'
                        }
                    ).then(answers => {
                        if (answers.addAnother) {
                            newInventory();
                        } else {
                            startMenu();
                        };
                })         
            })
        })
    })
};


function exit () {
    inquirer.prompt(
    {
        type: 'confirm',
        name: 'exit',
        message: 'Are you sure you want to exit?',
    })
    .then(answers => {
        if (answers.exit) {
            connection.end();
        } else {
            startMenu();
        };
    });
};