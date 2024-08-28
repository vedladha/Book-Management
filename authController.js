const User = require("../models/models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
class AuthController {
  async getLoginPage(req, res) {
    try {
      res.render("login");
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      const token = jwt.sign({ userId: user._id }, "THISISSECRET", {
        expiresIn: "1hr",
      });

      res.cookie("jwt", token, { httpOnly: true });
      res.render("dashboard", { email });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Login failed" });
    }
  }

  async getRegisterPage(req, res) {
    try {
      res.render("register");
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async register(req, res) {
    try {
      const { email, name, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, name, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "User registered succesfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Registeration failed" });
    }
  }

  logout(req, res) {
    res.clearCookie("jwt");
    res.render("login", { message: "Logout successful." });
  }

  getForgotPassword(req, res) {
    res.render("forgot-password");
  }

  async forgotpassword(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // const token = crypto.randomBytes(20).toString("hex");
      // user.resetPasswordToken = token;
      // user.resetPasswordExpires = Date.now() + 3600000;
      // await user.save();

      const token = jwt.sign({ email }, "THISISSECRET", {
        expiresIn: "1hr",
      });

      const resetLink = `http://${req.headers.host}/reset-password/${token}`;

      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: "vedantladha2004@gmail.com",
        to: user.email,
        subject: "Password Reset",
        text: `You are receiving this because you have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetLink}\n\n
        If you did not request this, please ignore this email.\n`,
      };

      const response = await transporter.sendMail(mailOptions);
      console.log(response);
      res.json({ message: response.response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  getResetPassword(req, res) {
    const token = req.params.id;
    res.render("reset-password", { token });
  }

  async resetPassword(req, res) {
    const { newPassword, token } = req.body;
    const decode = jwt.verify(token, "THISISSECRET");
    const { email } = decode;

    try {
      const user = await User.findOne({ email });
      console.log(user);

      if (!user) {
        return res
          .status(400)
          .json({ error: "Password reset token invalid or expired" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;

      await user.save();

      res.status(200).json({ message: "Successfully reset" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = new AuthController();
