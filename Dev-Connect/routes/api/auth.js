const express = require('express');
const router = express.Router();


// @route   GET api/auth/test
// @desc    Test auth route
// @access  Public
router.get("/test", (req, res) => {
  res.json({message: "Auth Route Works!!"});
})

module.exports = router;
