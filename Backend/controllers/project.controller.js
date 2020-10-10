const Project = require("../models/project.model");
const Observation = require('../models/observation.model');
const User = require('../models/user.model');
var fs = require('fs');

// Default route http://localhost:3000/

// Create and Save a new Project
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }

    // Create a Project
    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      dateCreated: req.body.dateCreated,
      
    });

    // uploaded image handle
    if (req.body.image){ // if image is not null
      project.image.data = (req.body.image);
      project.image.contentType = "image/jpeg";
    }
    else{ // assing no image available otherwise
      project.image.data = "data:image/jpeg;base64,";
      project.image.contentType = "image/jpeg";
    }
    
    // Save Project in the database
    project
      .save(project)
      .then(data => {
          // console.log(req.body.admin);
          User.findOne({username: req.body.admin}, (err, result) => {
              if (result){
                result.projectAdmin.push(project);
                result.save();

                project.admin= result._id;
                project.save();
              }
          });
          res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Observation."
        });
      });
  
  };

// Retrieve all Projects from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  

    // if (req.session.username){
      Project.find(condition)
      .then(data => {
        
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving projects."
        });
      });
    // }
    // else {
    //   // data = "Please login first";
    //   // res.send({message: "Please login first"});
    // }
    
  };

// Find a single Project with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Project.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Project with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Project with id=" + id });
      });
  };

// Find a single Project with a name
// exports.findOneName = (req, res) => {

//   Project.findOne({name: req.params.name}, (err, data) => {
//     if (!data)
//       res.status(404).send({ message: "Not found Project with name " + name });
    
//     else res.send(data);
//   })
//   .catch(err => {
//       res
//         .status(500)
//         .send({ message: "Error retrieving Project with name=" + name });
//     });
// };

// Find admin from a Project name
// exports.findAdmin = (req, res) => {

//   Project.find({name: req.params.name}, (err, data) => {
//     if (!data)
//       res.status(404).send({ message: "Not found Project with name " + name });
    
//     else res.send(data);
//   })
//   .populate('admin', 'username firstName lastName')
//   .catch(err => {
//       res
//         .status(500)
//         .send({ message: "Error retrieving Observation with name=" + name });
//     });
// };

/* -- Update a Project by the id in the request -- */
/*    Allows updates to name, description, admin   */

exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
    
  
    Project.findById(id, req.body, (err, data) => {
      
      if (!data) {
        res.status(404).send({
          message: `Cannot update Project with id=${id}. Maybe Project was not found!`
        });
      } 
      else {

        // delete the project from the referencing user
        User.findByIdAndUpdate(data.admin, { $pull: { 'projectAdmin': data._id } }, (err, result) => {
          if (err) { return handleError(res, err); }
        });

        // update project attributes
        for(var key in req.body) {
          if(req.body.hasOwnProperty(key)){
            data[key] = req.body[key];
          }
        }
        data.save(function(err){
          res.send({ message: "Project was updated successfully." });
          
          // Update the referencing user to add project in projectAdmin
          User.findById(data.admin, (err, result) => {
            if (result){
              result.projectAdmin.push(data);
              result.save();
            }
          })         
        });
      }
    })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Project with id=" + id
        });
      });
 
  };



// Delete a Project with the specified id in the request
/* Will delete the referencing user */
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Project.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Project with id=${id}. Maybe Project was not found!`
          });
        } else {
          res.send({
            message: "Project was deleted successfully!"
          });

          // Deleting project in user schema referencing the deleted project 
          User.findByIdAndUpdate(data.admin, { 'projectAdmin': null }, (err, result) => {
            if (err) { return handleError(res, err); }
        });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Project with id=" + id
        });
      });
  };

 
// Delete all Projects from the database.
exports.deleteAll = (req, res) => {
  Project.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Projects were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all projects."
      });
    });
};
