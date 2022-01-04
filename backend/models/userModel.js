const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "Already taken"],
    required: [true, "please enter your username"],
    text: true,
  },
  userSettings: {
    type: Object,
    default: {
      sounds: true,
      darkMode: true,
    },
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    require: [true, "please enter your email address"],
    unique: [true, "Already taken"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    text: true,
  },
  phoneNumber: Number,
  photo: {
    public_id: {
      type: String,
      default: "vnipggskleq5bkca63pa",
    },
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/jamessimonsd/image/upload/v1640856993/istockphoto-1127169576-612x612_lwhoxu.jpg",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "user", "manager", "staff"],
    },
    default: "user",
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "password must have at least 6 characters"],
    select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password doesn't match",
    },
  },
  whereabouts: {
    address: String,
    city: String,
    state: String,
    district: String,
    country: String,
    zipCode: Number,
  },
  followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  about: String,
  lastActivity: Date,
  status: {
    type: String,
    enum: ["online", "away", "offline", "busy", "hidden"],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmation = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
