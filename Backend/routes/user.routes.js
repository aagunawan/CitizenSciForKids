module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    /* --- Create a new User --- */
    // server sends back the newly created user object
    /* POST JSON body :
      { "username": "u1",
	      "firstName": "John",
        "lastName": "Smith",
        "password": "1234" } */
    /* user schema also has array of observationsCreated and array of projectAdmins. 
       But user is typically first created before any observations or projects are linked. 
       Although the controller currently can handle observations associations when new projects are created */
    router.post("/", users.create);
  
    /* --- Retrieve all User --- */
    // server sends back all users object
    router.get("/", users.findAll);
  
    /* --- Retrieve a single Users with id --- */
    // server sends back the user object associated with the id
    router.get("/:id", users.findOne);

    /* --- Update a User with id --- */
    /* server sends back the newly updated user object
       PUT JSON body :
    { "username": "u1-update",
	      "firstName": "John-update",
        "lastName": "Smith-update",
        "password": "1234-update"} */
    router.put("/:id", users.update);
  
    /* --- Delete a User with id --- */
    router.delete("/:id", users.delete);
  
    /* --- Delete All Users --- */
    router.delete("/", users.deleteAll);

    router.post("/login", users.login);

    /* --- Routes that may not be needed --- */
    // Retrieve a single User with name
    // router.get("/by_name/:name", users.findOneName);

    // Retrieve all Observations in a single User name
    // router.get("/by_name/:name/observations", users.findAllObservations);
  
    app.use('/api/users', router);
  };