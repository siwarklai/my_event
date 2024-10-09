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
    phone: { type: String, required: true },
    ID: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, {
    timestamps: true  // This option should be here
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
        status: Joi.string().valid('active', 'suspendu').default('activé'),

    });
    return schema.validate(data);
};

module.exports = { User, validate };

