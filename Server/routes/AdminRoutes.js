require("dotenv").config();
const express = require("express");
const router = express.Router();

router.post(process.env.adminlogin, (req, res) => {
  const Name = req.body.userName;
  const Password = req.body.password;

  if (Name === "Arousers" && Password === "Chutney1!") {
    return res.send({
      msg: "success",
    });
  } else {
    return res.send({
      msg: "fail",
    });
  }
});

module.exports = router;
