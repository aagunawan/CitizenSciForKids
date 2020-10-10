module.exports = app => {
    const observations = require("../controllers/observation.controller.js");
  
    var router = require("express").Router();
  
    /* --- Create a new Observation --- */
    // server sends back the newly created observation object
    /* POST JSON body :
      { "title": "o1",
        "createdBy": "u1", (may need a drop down of list of users)
        "description": "",
        "project": "p1" (may need a drop down of list of projects),
        "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAA"
      } */
    /* observation schema is typically created last after the user for createdBy and 
    project that the observation is associated to has been created */
    router.post("/", observations.create);
  
     /* --- Retrieve all Observations --- */
    // server sends back all observations object
    router.get("/", observations.findAll);
  
    /* --- Retrieve an Observation with id --- */
    // server sends back the project object associated with the id
    router.get("/:id", observations.findOne);
  
    /* --- Update an Observation with id  --- */
    // server sends back the newly updated observation object
    /* PUT JSON body :
    { "title": "o1-update",
        "createdBy": "u1-update" (may need a drop down menu),
        "description": "",
        "project": "p1" (may need a drop down menu)} */
    router.put("/:id", observations.update);
    
    /* --- Delete an Observation with id --- */
    router.delete("/:id", observations.delete);
  
    /* --- Delete All Observations (may not be needed) --- */
    router.delete("/", observations.deleteAll);

    /* --- handling upload image on an existing observation --- */
    /* {
      "image": { "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAA  }
      } */
    router.put("/image_upload/:id", observations.saveImage);

    /* --- Routes that may not be needed --- */
    // Retrieve a single Observation with title
    // router.get("/by_title/:title", observations.findOneTitle);
  
    app.use('/api/observations', router);
  };