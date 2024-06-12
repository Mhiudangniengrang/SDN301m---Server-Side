const Watches = require("../model/watchSchema");
const Brand = require("../model/brandSchema");
const Members = require("../model/memberSchema");

const homePageAdmin = (req, res) => {
  const membername = req.cookies.membername || "Guest";
  res.render("watchesCreate", { membername });
};

const createWatch = async (req, res) => {
  try {
    const { watchName, image, price, watchDescription, comments, brand } =
      req.body;
    const Automatic = req.body.Automatic === "on";

    if (!watchName || !image || !price || !watchDescription || !brand) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      return res.status(400).json({ error: "Invalid brand ID" });
    }

    const newWatch = new Watches({
      watchName,
      image,
      price,
      Automatic,
      watchDescription,
      comments,
      brand,
    });

    const savedWatch = await newWatch.save();
    res.redirect("/admin/watches");
  } catch (error) {
    console.error("Error creating watch:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const brandPage = async (req, res) => {
  const membername = req.cookies.membername || "Guest";
  try {
    const brands = await Brand.find();
    return res.render("brandsCreate", { brands: brands, membername });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const addBrandPage = async (req, res) => {
  try {
    const { brandname } = req.body;
    const newBrand = new Brand({ brandname });
    await newBrand.save();
    res.redirect("/admin/brands");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWatches = async (req, res) => {
  try {
    const watches = await Watches.find();
    res.json(watches);
  } catch (error) {
    console.error("Error fetching watches:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteWatch = async (req, res) => {
  try {
    const { id } = req.params;
    await Watches.findByIdAndDelete(id);
    res.status(200).json({ message: "Watch deleted successfully" });
  } catch (error) {
    console.error("Error deleting watch:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    await Brand.findByIdAndDelete(id);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await Members.find();
    res.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await Members.findByIdAndDelete(id);
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const dashboard = async (req, res) => {
  const membername = req.cookies.membername || "Guest";
  try {
    const members = await Members.find(); // Assuming you're fetching members to display
    const watches = await Watches.find(); // Assuming you're fetching watches to display
    const brands = await Brand.find(); // Assuming you're fetching brands to display

    res.render("admin/dashboard", {
      membername,
      members,
      watches,
      brands,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard", error });
  }
};
// Update Member
const updateMember = async (req, res) => {
  const { id } = req.params;
  const { membername, name, YOB } = req.body;
  try {
    const updatedMember = await Members.findByIdAndUpdate(
      id,
      { membername, name, YOB },
      { new: true }
    );
    // res.json(updatedMember);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Watch
const updateWatch = async (req, res) => {
  const { id } = req.params;
  const {
    watchName,
    image,
    price,
    Automatic,
    watchDescription,
    comments,
    brand,
  } = req.body;
  try {
    const updatedWatch = await Watches.findByIdAndUpdate(
      id,
      { watchName, image, price, Automatic, watchDescription, comments, brand },
      { new: true }
    );
    // res.json(updatedWatch);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error updating watch:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Brand
const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { brandname } = req.body;
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { brandname },
      { new: true }
    );
    // res.json(updatedBrand);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// Hiển thị trang chỉnh sửa thành viên
const editMemberPage = async (req, res) => {
  const membername = req.cookies.membername || "Guest";
  const member = await Members.findById(req.params.id);
  res.render("editMember", { member, membername });
};

// Hiển thị trang chỉnh sửa đồng hồ
const editWatchPage = async (req, res) => {
  const membername = req.cookies.membername || "Guest";
  const watch = await Watches.findById(req.params.id);
  res.render("editWatches", { watch, membername });
};

// Hiển thị trang chỉnh sửa nhãn hiệu
const editBrandPage = async (req, res) => {
  const membername = req.cookies.membername || "Guest";
  const brand = await Brand.findById(req.params.id);
  res.render("editBrand", { brand, membername });
};
module.exports = {
  homePageAdmin,
  createWatch,
  brandPage,
  addBrandPage,
  getWatches,
  deleteWatch,
  getBrands,
  deleteBrand,
  getMembers,
  deleteMember,
  dashboard,
  updateMember,
  updateWatch,
  updateBrand,
  editBrandPage,
  editMemberPage,
  editWatchPage,
};
