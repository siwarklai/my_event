const { required } = require("joi");
const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    lieu: {
      type: String,
      required: true,
    },
    codePostale: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{4}$/.test(v); 
        },
        message: props => `${props.value} is not a valid 4-digit postal code!`
      },
    },
    dateDebut: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.dateFin ? value <= this.dateFin : true; 
        },
        message: "La date de début doit être antérieure ou identique à la date de fin."
      },
      validate: {
        validator: function (value) {
          return value >= Date.now(); 
        },
      },
    },
    dateFin: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.dateDebut ? value >= this.dateDebut : true; 
        },
        message: "La date de fin doit être postérieure ou identique à la date de début."},
        
    },
    budget: {
      type: Number,
      required: true,
      min: [0, 'Le budget doit être supérieur ou égal à 0.'],
    },
    creator: { 
      type: String, 
      required: true },
  },
  
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
