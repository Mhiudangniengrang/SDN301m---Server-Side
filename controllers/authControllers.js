const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Member = require("../model/memberSchema"); // Adjust the path as needed

const signin = (req, res) => {
  return res.render("signin");
};

const signinSuccess = async (req, res) => {
  try {
    const check = await Member.findOne({ membername: req.body.membername });
    if (!check) {
      return res.status(404).send("Username cannot be found");
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      const key = process.env.JWT_SECRET;
      if (!key) {
        console.error("JWT_SECRET is not set.");
        return res.status(500).send("Internal server error");
      }
      const token = jwt.sign(
        {
          memberId: check._id,
          membername: check.membername,
          isAdmin: check.isAdmin,
        },
        key,
        { expiresIn: "1h" }
      );
      res.cookie("token", token, { httpOnly: true });
      res.cookie("membername", check.membername, { httpOnly: true });
      res.cookie("memberId", check._id.toString(), { httpOnly: true });

      return check.isAdmin
        ? res.redirect("/admin/dashboard")
        : res.redirect("/watches");
    } else {
      return res.status(401).send("Wrong password");
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Internal server error");
  }
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

    return res.status(201).json({ message: "Sign-up successful", newMember });
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
