const Watches = require("../model/watchSchema");
const Members = require("../model/memberSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { membername, password } = req.body;
  try {
    console.log("Received membername:", membername);
    console.log("Received password:", password);

    const user = await Members.findOne({ membername });

    if (!user) {
      console.log("User not found");
      return res
        .status(401)
        .json({ message: "Invalid membername or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password");
      return res
        .status(401)
        .json({ message: "Invalid membername or password" });
    }

    // Generate JWT token
    const key = process.env.JWT_SECRET;
    if (!key) {
      console.error("JWT_SECRET is not set.");
      return res.status(500).json({ message: "Internal Server Error" });
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

    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const signup = async (req, res) => {
  const { membername, password, name, YOB } = req.body;
  try {
    const existingMember = await Members.findOne({ membername });
    if (existingMember) {
      return res.status(409).json({ message: "Membername already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = new Members({
      membername,
      password: hashedPassword,
      name,
      YOB,
    });

    await newMember.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getAllWatches = async (req, res) => {
  try {
    const watches = await Watches.find().populate("brand", "brandname");
    res.status(200).json({ data: watches });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getWatchById = async (req, res) => {
  const { id } = req.params;
  try {
    const watch = await Watches.findById(id)
      .populate("brand", "brandname")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name",
        },
      });
    if (!watch) {
      return res.status(404).json({ message: "Watch not found" });
    }
    res.status(200).json({ data: watch });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getWatchesByBrand = async (req, res) => {
  const { brandId } = req.params;
  try {
    const watches = await Watches.find({ brand: brandId }).populate(
      "brand",
      "brandname"
    );

    if (watches.length === 0) {
      return res
        .status(404)
        .json({ message: "No watches found for this brand" });
    }

    res.status(200).json({ data: watches });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const searchWatchesByName = async (req, res) => {
  const { name } = req.params;
  try {
    const watches = await Watches.find({
      watchName: new RegExp(name, "i"),
    }).populate("brand", "brandname");

    if (watches.length === 0) {
      return res
        .status(404)
        .json({ message: "No watches found with that name" });
    }

    res.status(200).json({ data: watches });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await Members.find().select("-password");
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getAllWatches,
  login,
  signup,
  getWatchById,
  getWatchesByBrand,
  searchWatchesByName,
  getAllUsers,
};
