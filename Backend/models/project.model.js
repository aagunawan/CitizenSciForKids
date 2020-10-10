
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
  name: 
    { type: String, 
      required: true,
      unique: true,
      maxlength: 255    
    },
    description: String, 
    dateCreated: {type: Date, default: Date.now },
    image: {
      data: String,
      contentType: String
    },
    observations: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Observation"
    }],
    admin: {  // a project can only have 1 admin. It can get updated later. 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
})

ProjectSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

module.exports = mongoose.model("Project", ProjectSchema);

