const express = require("express");
const router = express.Router();

const sendEmail = require("../utils/email-service");

router.get("/test-email", async (req, res) => {

  try {

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "DreamHaven Email Test",
      text: "Email system is working successfully."
    });

    res.json({
      success: true,
      message: "Test email sent"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Email failed"
    });

  }

});

module.exports = router;