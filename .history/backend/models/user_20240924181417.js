const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    position: { type: String, required: true },
    validate: [
      {
        // First validator: check that it starts with 46, 2, 9, or 5
        validator: function (v) {
          return /^(46|2|9|5)/.test(v); // Check only the beginning
        },
        message: props => `${props.value} doit commencer par 46, 2, 9 ou 5 !`, // Custom message for starting digits
      },
      {
        // Second validator: check that it has exactly 8 digits
        validator: function (v) {
          return /^\d{8}$/.test(v.trim()); // Check that it's exactly 8 digits
        },
        message: props => `${props.value} doit avoir exactement 8 chiffres !`, // Custom message for length
      },
    ],
    ID: { type: String, required: true, unique: true,
        validate: {
        validator: function (v) {
          return /^\d{8}$/.test(v); 
        },
        message: props => `${props.value} n'est pas valide !`
      }, },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'suspendu'], default: 'active'},
    failedAttempts:{type: Number , default: 0}
}, {
    timestamps: true  
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWTPRIVATEKEY, {
        expiresIn: "30d",
    });
    return token;
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        position: Joi.string().required().label("Job Position"),
        phone: Joi.string().required().label("Phone Number"),
        ID: Joi.string().required().label("ID Number"),
        role: Joi.string().valid('user', 'admin').default('user'),
        status: Joi.string().valid('active', 'suspendu').default('active'),
        failedAttempts: Joi.number().integer().min(0).default(0)
    });
    return schema.validate(data);
};

module.exports = { User, validate };

