const mongoose = require('mongoose');
const ObservationSchema = new mongoose.Schema({
    title: {type: String, 
        required: true,
        unique: true,
        maxlength: 255    
    },
    createdBy: {  // an observation can only have 1 user creating it and cannot change it once created
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    description: String, 
    image: {
      data: String,
      contentType: String
    },
    // loc: {
    //   type: { type: String },
    //   coordinates: [Number],
    // },
    dateCreated: {type: Date, default: Date.now },
    project: { // an observation can only belong to 1 project and cannot change it once created
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }     
    },
    { timestamps: true }
);

ObservationSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

module.exports = mongoose.model("Observation", ObservationSchema);