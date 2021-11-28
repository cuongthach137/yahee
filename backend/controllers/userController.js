const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getUser = catchAsync(async (req, res, next) => {
  res.status(201).json({
    status: "success",
    user: req.user,
  });
});
exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    users,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { address, country, state, city, zipCode, district } = req.body;

  if (address || country || state || city || zipCode || district) {
    const user = await User.findByIdAndUpdate(_id, {
      ...req.body,
      whereabouts: {
        address,
        country,
        state,
        city,
        zipCode,
        district,
      },
    });
    res.status(200).json({
      status: "success",
      user,
    });
  } else {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      user,
    });
  }
});

exports.updateUserActivity = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findByIdAndUpdate(_id, {
    ...req.body,
  });
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.getUsersOnSearch = catchAsync(async (req, res, next) => {
  const { term } = req.params;

  const users = await User.find({
    $text: { $search: term },
  }).limit(15);
  res.status(200).json({
    status: "success",
    users,
  });
});

exports.getUsersExcept = catchAsync(async (req, res, next) => {
  const { users: members } = req.body;

  const users = await User.find({
    _id: {
      $nin: members,
    },
  });
  res.status(200).json({
    status: "success",
    users,
  });
});
