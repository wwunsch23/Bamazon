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

// Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
connection.connect(err => {
    if (err) {
      throw err;
    }
    //console.log("connected as id " + connection.threadId + "\n");
    getItemsForSale();
});

function getItemsForSale () {
    connection.query("SELECT item_id, department_name, product_name, price FROM products",
    function(err, data) {
            if (err) throw err;
            console.table('\nItems For Sale',data)   
            getItemToBuy();    
        });
};


// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
const questions = [
    {
        type:'input',
        name:'selectedID',
        message:"What is the ID of the item you would like to buy?",
        validate: function(value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
          },
          filter: Number
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'How many units of that item would you like to buy?',
        validate: function(value) {
          var valid = !isNaN(parseFloat(value));
          return valid || 'Please enter a number';
        },
        filter: Number
      }
];

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

function getItemToBuy () {
    inquirer.prompt(questions).then(answers => {
        //console.log(JSON.stringify(answers, null,' '));
        connection.query("SELECT item_id, stock_quantity FROM products WHERE ?",
        [{'item_id':answers.selectedID}],
        (err, data) => {
            if (err){
                throw err;
            };
            if (answers.quantity > data[0].stock_quantity) {
                console.log(`There is only ${data[0].stock_quantity} units of that product currently in stock. Please enter a different amount to buy.`)
                getItemToBuy();
            } else {
                let newQuantity = data[0].stock_quantity - answers.quantity;
                updateQuantity(answers.quantity,newQuantity,data[0].item_id);
            };
        })
    })
};

// However, if your store does have enough of the product, you should fulfill the customer's order.
// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

function updateQuantity (buyQuantity,newQuantity,id) {
    let criteria = [];
    criteria.push(newQuantity,id);
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",criteria,
    (err, data) => {
        if (err) {
            throw err;
        }
        console.log("Update made to the database.");
        displayTotal(buyQuantity, id);
    })
};

function displayTotal(buyQuantity, id) {
    let totalCriteria = [];
    totalCriteria.push(buyQuantity, id);
    connection.query("SELECT product_name, ? * price AS Total FROM products WHERE item_id = ?", totalCriteria, (err, data) => {
        if (err) {
            throw err;
        }
        console.log(`You purchased ${buyQuantity} units of ${data[0].product_name} for a total cost of $${data[0].Total}.`);
    });
};
