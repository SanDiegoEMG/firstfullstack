require(`dotenv`).config();
var express = require("express");
var app = express();
var mysql = require('mysql');
var exphbs = require('express-handlebars');

// tells server to accept these forms of data
// keep this up top close under require variables
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

var PORT = process.env.PORT || 8080;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQLPASS,
    database: "burgers_db"
});

// Make connection.
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});



// handlebar requirements -- must be above the routes
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// app.get("/", function (req, res) {
//     res.send("Fight one giant at a time")
// });


// app.get("/api/burger", function (req, res) {
//     connection.query("SELECT * FROM burgers", function (err, data) {
//         if (err) throw err;
//         res.json(data);
//     })
// })

app.get("/api/burger/:id", function (req, res) {
    connection.query("SELECT * FROM burgers WHERE id = ?", [req.params.id], function (err, data) {
        if (err) throw err;
        res.json(data);
    })
})

app.get("*", function (req, res) {
    connection.query("SELECT * FROM burgers", function (err, data) {
        res.render("home", {
            burgers: data
        })
    })
})

app.post("/api/burger", function (req, res) {
    connection.query("INSERT INTO burgers SET ?", [req.body], function(err, data){
        if(err) throw err;
        res.redirect("/home");
    })
});

app.delete("/api/burger/:id", function(req, res){
    var id = req.params.id;
    connection.query("DELETE FROM burgers WHERE id = ?", [id], function(err, data) {
        if(err) throw err;
        res.json(data);
    });
});

app.put("/api/burger/:id", function(req, res){
    var id = req.params.id;
    connection.query("UPDATE burgers SET devoured = 1 WHERE id = ?", [id], function(err, data) {
        if(err) throw err;
        console.log(id);
        res.json(data);
    });
});

app.listen(PORT, function () {
    console.log(`Server is running on http://localhost:${PORT}`);
});