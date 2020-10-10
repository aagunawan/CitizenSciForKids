module.exports = app => {
    const projects = require("../controllers/project.controller.js");
  
    var router = require("express").Router();
  
    /* --- Create a new Project --- */
    // server sends back the newly created project object
    /* POST JSON body :
      { "name": "p1",
        "admin": "u1", (may need a drop down of list of users)
        "description": "",
        "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAA"
      } */
    /* project schema also has array of observations but typically we create project first before observations. 
       Although the controller currently can handle observations associations when new projects are created. */
    router.post("/", projects.create);
 
    /* --- Retrieve all Projects --- */
    // server sends back all project object
    router.get("/", projects.findAll);
   
    /* --- Retrieve a single Project with id --- */
    // server sends back the project object associated with the id
    router.get("/:id", projects.findOne);

    /* --- Update a Project with id  --- */
    // server sends back the newly updated project object
    /* PUT JSON body :
    { "name": "p1-update",
      "admin": "u1-update" (may need a drop down)
      "description": "" } */
    router.put("/:id", projects.update);
   
    /* --- Delete a Project with id --- */
    router.delete("/:id", projects.delete);

    /* --- Delete All Projects (may not be needed) --- */
    router.delete("/", projects.deleteAll);


    /* --- Routes that may not be needed --- */
    // Retrieve admin from a Project name (not needed at this point)
    // router.get("/by_name/:name/admin", projects.findAdmin);

    // Retrieve a single Project with name (May not be needed)
    // server sends back the project object associated with the specifed name
    // router.get("/by_name/:name", projects.findOneName);
  
  
    app.use('/api/projects', router);
  };