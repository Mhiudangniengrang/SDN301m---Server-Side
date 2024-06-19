const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Member = require("../model/memberSchema");

const signin = (req, res) => {
  return res.render("signin", { message: req.flash("error") });
};

const signinSuccess = async (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).send("Internal server error");
    }
    if (!user) {
      return res.status(401).send(info.message);
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).send("Internal server error");
      }

      const key = process.env.JWT_SECRET;
      if (!key) {
        console.error("JWT_SECRET is not set.");
        return res.status(500).send("Internal server error");
      }

      const token = jwt.sign(
        {
          memberId: user._id,
          membername: user.membername,
          isAdmin: user.isAdmin,
        },
        key,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, { httpOnly: true });
      res.cookie("membername", user.membername, { httpOnly: true });
      res.cookie("memberId", user._id.toString(), { httpOnly: true });

      return user.isAdmin
        ? res.redirect("/admin/dashboard")
        : res.redirect("/watches");
    });
  })(req, res);
};

const signup = (req, res) => {
  return res.render("signup");
};

const signUpSuccess = async (req, res) => {
  const { membername, password, name, YOB } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = new Member({
      membername,
      password: hashedPassword,
      name,
      YOB,
      isAdmin: false,
    });

    await newMember.save();

    console.log("Member registered:", newMember);

    res.redirect("/");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Membername already exists" });
    }
    return res.status(500).json({ message: "Server error", error });
  }
};

const signUpAdmin = async (req, res) => {
  const { membername, password, name, YOB } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Member({
      membername,
      password: hashedPassword,
      name,
      YOB,
      isAdmin: true,
    });

    await newAdmin.save();

    return res
      .status(201)
      .json({ message: "Admin sign-up successful", newAdmin });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Membername already exists" });
    }
    return res.status(500).json({ message: "Server error", error });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("membername");
  res.clearCookie("memberId");
  res.redirect("/");
};

module.exports = {
  signin,
  signinSuccess,
  signup,
  signUpSuccess,
  signUpAdmin,
  logout,
};
