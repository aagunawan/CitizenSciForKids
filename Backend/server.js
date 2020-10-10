const express = require("express");
const bodyParser = require("body-parser");
const session		= require('express-session');
const cors = require("cors");

const app = express();
app.use(session({
  resave: false,
  saveUninitialized: false, 
  cookie: {
    secure: false,
    maxAge: 36000000,
    httpOnly: false // <- set httpOnly to false
  },
  secret: 'SuperSecretPassword'}));


const db = require("./models");
db.mongoose.connect(db.url, { // Bug here on connect is not a function
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

var corsOptions = {
  // origin: "https://citizenscienceforkids-web.herokuapp.com"
  credentials: true,
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: "50mb"}));



// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));




// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Citizen Science application." });
});

require("./routes/project.routes")(app);
require("./routes/observation.routes")(app);
require("./routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

