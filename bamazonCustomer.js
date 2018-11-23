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
    connection.query("SELECT item_id, department_name, product_name,        CONCAT('$',FORMAT(price,2)) AS price FROM products",
    function(err, data) {
            if (err) {
                throw err;
            };
            console.table('\nItems For Sale',data)   
            inquirer.prompt([
                {
                type: "list",
                name: "itemToBuy",
                message: "Select which item you would like to buy.",
                choices: data.map(function (item) {
                  return item.product_name;
                })
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
            ])
            .then(answers => {
                //console.log(JSON.stringify(answers, null,' '));
                connection.query("SELECT item_id, stock_quantity FROM products WHERE ?",
                [{'product_name':answers.itemToBuy}],
                (err, data) => {
                    if (err){
                        throw err;
                    };
                    if (answers.quantity > data[0].stock_quantity) {
                        console.log(`There is only ${data[0].stock_quantity} units of that product currently in stock. Please enter a different amount to buy.`)
                        getItemsForSale();
                    } else {
                        let newQuantity = data[0].stock_quantity - answers.quantity;
                        updateQuantity(answers.quantity,newQuantity,data[0].item_id);
                    };
            });
        })
    });
};

// // However, if your store does have enough of the product, you should fulfill the customer's order.
// // This means updating the SQL database to reflect the remaining quantity.
// // Once the update goes through, show the customer the total cost of their purchase.

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
        let totalPrice = data[0].Total.toFixed(2);
        console.log(`You purchased ${buyQuantity} units of ${data[0].product_name} for a total cost of $${totalPrice}.`);
    });
};
