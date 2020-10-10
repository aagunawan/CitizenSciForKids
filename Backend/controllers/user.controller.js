const bcrypt = require('bcrypt');
const _ = require('lodash');
const Project = require("../models/project.model");
const Observation = require('../models/observation.model');
const User = require('../models/user.model');

// Create and Save a new User
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.username) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }

    // Create a User
    const user = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      dateJoined: req.body.dateJoined,
      isTeacher: req.body.isTeacher
    });

    // hash the password
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(user.password, salt);
  
    // Save User in the database and updating project to have the corresponding admin
    await user
      .save(user)
      .then(data => {
          // Update Project
          Project.findOne({name: req.body.projectAdmin}, (err, result) => {

              if (result){
                result.admin = user;
                result.save(function(){

                    // Update Observation: May not be needed.
                    Observation.findOne({title: req.body.observationsCreated}, (err, result) => {
                    
                        if (result){
                        result.createdBy = user;
                        result.save();
                        user.observationsCreated.push(result); 
                        user.save();
                        }
                    });
                });
                user.projectAdmin.push(result); 
                user.save();
              }
          });
          
          // res.send(data);
          res.send(_.pick(data, ['username', 'firstName', 'lastName']));
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Observation."
        });
      });
  };

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

    User.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving projects."
        });
      });
  };

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found User with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving User with id=" + id });
      });
  };

// // Find a single User with a name
// exports.findOneName = (req, res) => {

//   User.findOne({name: req.params.name}, (err, data) => {
//     if (!data)
//       res.status(404).send({ message: "Not found User with name " + name });
    
//     else res.send(data);
//   })
//   .catch(err => {
//       res
//         .status(500)
//         .send({ message: "Error retrieving User with name=" + name });
//     });
// };

// // Find all observations in a User with a username
// exports.findAllObservations = (req, res) => {

//   User.find({username: req.params.username}, (err, data) => {
//     if (!data)
//       res.status(404).send({ message: "Not found Observation for username " + username });
    
//     else res.send(data);
//   })
//   .populate('observations')
//   .catch(err => {
//       res
//         .status(500)
//         .send({ message: "Error retrieving Observation for username=" + username });
//     });
// };

/* --------- Update a User by the id in the request ------------ */
/* allows updates for first name, last name, username, isTeacher */
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    User.findByIdAndUpdate(id, req.body, (err, data) => {
      
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } 
      else {
        for(var key in req.body) {
          if(req.body.hasOwnProperty(key)){
            data[key] = req.body[key];
          }
        }
        data.save(function(err){
        res.send({ message: "User was updated successfully." });
        });
      }
    })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
      });
 
  };


/*--- Delete a User with the specified id in the request ---*/
/* Will cascade delete user ref in project and observation */
exports.delete = (req, res) => {
    const id = req.params.id;
  
    User.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        } else {
            res.send({
                message: "User was deleted successfully!"
            });

            // Deleting user in project schema referencing the deleted user 
            // Need to iterate through all projects the user is an admin of
            data.projectAdmin.forEach(projectAdmin => {
              Project.findByIdAndUpdate(projectAdmin, { 'admin': null }, (err, result) => {
                if (err) { return handleError(res, err); }
              });
            })
            

            // Deleting user in observation schema referencing the deleted user 
            // Need to iterate through all observations the user has created
            data.observationsCreated.forEach(observationsCreated => {
              Observation.findByIdAndUpdate(observationsCreated, { 'createdBy': null }, (err, result) => {
                if (err) { return handleError(res, err); }
             });
            })
            
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
  };
 
// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all projects."
      });
    });
};

// GET login page
// exports.login = function (req, res) {
//   res.render('login-form', {title: 'Log in'})
//   }

// POST login page
exports.login = (req, res) => {
  var context = {};
  //Name submitted from newSession page
  User.findOne({ username: req.body.username }, (err, user) => {
      if (!err) {
        if (!user){
          res.sendStatus(204);
        } 
        else {
          //Set session name to name from request page
        
          if (user.password === req.body.password) {
            req.session.username = req.body.username;
            req.session.loggedin = "true";
            // console.log(req.sessionID );
            // req.session.save()
            // res.redirect('/');
            // res.locals.session = req.session;
            res.sendStatus(200);
        
            
          } 
          else {
            res.sendStatus(204);
          }
          
        }
      }
    
      
  });

//If there is no session, go to the main page


};