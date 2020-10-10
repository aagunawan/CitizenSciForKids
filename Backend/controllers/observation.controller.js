
const Observation = require('../models/observation.model');
const Project = require("../models/project.model");
const User = require('../models/user.model');

// handling upload image on an existing observation
exports.saveImage = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const id = req.params.id;

  Observation.findByIdAndUpdate(id, req.body, (err, data) => {
    // console.log(req.body.image)
    if (!data) {
      res.status(404).send({
        message: `Cannot update Observation with id=${id}. Maybe Observation was not found!`
      });
    } 
    else {
      if (req.body.image){ // if image is not null
        // console.log(req.body.image);
        // data.image.data = "";
        // data.image.contentType = "image/jpeg";
        // console.log(data);
        res.send({ message: "Observation was updated successfully." });
      }
      // if(req.body.image){
        // data.image.push(req.body);
        // // console.log(data)
        // data.save(function(err){
        
        
      // }
    }
 
        
    
      
    
  })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Observation with id=" + id
      });
    });


}

// Create and Save a new Observation
exports.create = (req, res) => {

    // Validate request
    if (!req.body.title) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }

    // Create a Observation

    const observation = new Observation({
      title: req.body.title,
      description: req.body.description,
      dateCreated: req.body.dateCreated,
      

    });

    if(req.body.image){
      observation.image.data = (req.body.image);
    }
    else{ // assing no image available otherwise
      observation.image.data = "data:image/jpeg;base64,";
      observation.image.contentType = "image/jpeg";
    }
    

    // Save Observation in the database
    observation
      .save(observation)
      .then(data => {
          Project.findOne({name: req.body.project}, (err, result) => {
              if (result){
                result.observations.push(observation);
                result.save(function(){
                  User.findOne({username: req.body.createdBy}, (err, result) => {
                    if (result){
                      result.observationsCreated.push(observation);
                      result.save();
                      observation.createdBy = result._id;
                      observation.save();
                    }
                  }); 
                });
                observation.project= result._id;
                observation.save();
              }
          });
         
        // observation.save();
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Observation."
        });
      });
      
      
};

// Retrieve all Observations from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  
    Observation.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving observations."
        });
      });
  };

// Find a single Observation with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Observation.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Observation with id " + id });
        else {res.send(data)}
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Observation with id=" + id });
      });
  };

// Find a single Observation with a name
exports.findOneTitle = (req, res) => {

  Observation.findOne({title: req.params.title}, (err, data) => {
    if (!data)
      res.status(404).send({ message: "Not found Observation with title " + title });
    
    else res.send(data);
  })
  .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Observation with title=" + title });
    });
};


/* ----- Update an Observation by the id in the request ----- */
/* Allows for updating title, description, note, and project */

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Observation.findByIdAndUpdate(id, req.body, (err, data) => {
    
    if (!data) {
      res.status(404).send({
        message: `Cannot update Observation with id=${id}. Maybe Observation was not found!`
      });
    } 
    else {

      // delete the observation from the referencing project
      Project.findByIdAndUpdate(data.admin, { $pull: { 'observations': data._id } }, (err, result) => {
        if (err) { return handleError(res, err); }
      });

      for(var key in req.body) {
        if(req.body.hasOwnProperty(key)){
          data[key] = req.body[key];
        }
      }
      data.save(function(err){
        res.send({ message: "Observation was updated successfully." });

        // Update the referencing Project to add observation in observations
        Project.findById(data.admin, (err, result) => {
          if (result){
            result.observations.push(data);
            result.save();
          }
        })   

      });
    }
  })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Observation with id=" + id
      });
    });

};


/* --- Delete a Observation with the specified id in the request ---- */
/* Will also delete observation referenced in project and user schema */
exports.delete = (req, res) => {
  const id = req.params.id;

  Observation.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Observation with id=${id}. Maybe Observation was not found!`
        });
      } else {

          res.send({
            message: "Observation was deleted successfully!"
          });
          // Deleting observation in project referencing the observation
          Project.findByIdAndUpdate(data.project, { $pull: { 'observations': data._id } }, (err, result) => {
            if (err) { return handleError(res, err); }
          });

          // Deleting observation in user referencing the observation
          User.findByIdAndUpdate(data.createdBy, { $pull: { 'observationsCreated': data._id } }, (err, result) => {
            if (err) { return handleError(res, err); }
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Observation with id=" + id
      });
    });
  };

// Delete all Observations from the database.
exports.deleteAll = (req, res) => {
  Observation.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Observations were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all observations."
      });
    });
};
