const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require("fs");

const app = express();
const db = new sqlite3.Database(":memory:");

app.use(session({
    secret: "my_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Create users table and insert data
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)");
    db.run("INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin')");
    db.run("INSERT INTO users (username, password, role) VALUES ('user', 'password', 'user')");
    db.run("INSERT INTO users (username, password, role) VALUES ('manager', 'manager123', 'admin')");
});

// Log attacks to attack_log.txt
function logAttack(ip, query, username) {
    const logMessage = `[${new Date().toISOString()}] 🚨 SQL Injection Detected!
IP: ${ip}
Username: ${username}
Query: ${query}
-----------------------------\n`;
    
    console.log(logMessage); // Print to console
    fs.appendFileSync("attack_log.txt", logMessage); // Write to file
}

// Check if input has SQL Injection signs
function detectSQLInjection(input) {
    const pattern = /('|--|#|\/\*|\*\/|;|or |and )/i;
    return pattern.test(input);
}

// Login with SQL Injection detection
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const userIP = req.ip;

    if (detectSQLInjection(username) || detectSQLInjection(password)) {
        logAttack(userIP, `username: ${username}, password: ${password}`, username);
        return res.send("<h1>🚨 SQL Injection detected! Your action has been logged.</h1><a href='/'>Try again</a>");
    }

    const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log("[DEBUG] Running query:", sql);

    db.all(sql, [], (err, rows) => {
        if (rows.length > 0) {
            req.session.user = rows[0]; 

            if (rows[0].role === "admin") {
                db.all("SELECT * FROM users WHERE role = 'admin'", [], (err, admins) => {
                    let adminList = admins.map(a => `🛡️ ${a.username}`).join("<br>");
                    res.send(`<h1>Welcome ${rows[0].username}!</h1>
                              <p>🔐 Here is the list of admins:</p>
                              <p>${adminList}</p>
                              <a href='/logout'>Logout</a>`);
                });
            } else {
                res.send(`<h1>Welcome ${rows[0].username}!</h1>
                          <p>🛠️ You are a regular user.</p>
                          <a href='/logout'>Logout</a>`);
            }
        } else {
            res.send("<h1>Incorrect username or password</h1><a href='/'>Try again</a>");
        }
    });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
