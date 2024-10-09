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
    phone: { type: Number, required: true , validate: {
        validator: function (v) {
          
          return /^(46|2|9|5)\d{8}$/.test(v);
        },
        message: props => `${props.value} n'est pas valide !`
      },},
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

