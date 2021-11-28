const express = require("express");

const router = express.Router();

//middlewares
const checkAuth = require("../middlewares/checkAuth");
//controller
const {
  signup,
  login,
  updatePassword,
} = require("../controllers/authController");
const {
  getUser,
  updateUser,
  getUsers,
  updateUserActivity,
  getUsersOnSearch,
  getUsersExcept,
} = require("../controllers/userController");

router.post("/user/register", signup);

router.post("/user/login", login);

router.get("/user", checkAuth, getUser);

router.get("/users", getUsers);

router.post("/users/except", getUsersExcept);

router.put("/user/update", checkAuth, updateUser);

router.patch("/user/update-activity", checkAuth, updateUserActivity);

router.put("/user/update/password", checkAuth, updatePassword);

router.get("/users/search/:term", getUsersOnSearch);

module.exports = router;
