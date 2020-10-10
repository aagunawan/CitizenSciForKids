
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username:
    { type: String, 
      required: true,
      unique: true,
      maxlength: 255    
    },
    firstName: 
    { type: String, 
      required: true,
      maxlength: 255    
    },
    lastName:
    { type: String, 
      required: true,
      maxlength: 255    
      },    
    password: 
    { type: String,
      required: true
    },
    dateJoined: {type: Date, default: Date.now },
    isTeacher: {type: Boolean, default: 0},    // true if teacher or false if students

    projectAdmin: [{ // list of projects that user is an admin of
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      }],

    observationsCreated: [{ // list of observations that user has created
        type: mongoose.Schema.Types.ObjectId,
        ref: "Observation"
      }]
})

UserSchema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});


module.exports = mongoose.model("User", UserSchema);



