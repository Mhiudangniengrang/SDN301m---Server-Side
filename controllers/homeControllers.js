const Comment = require("../model/commentSchema"); // Adjust the path as necessary
const Brand = require("../model/brandSchema");
const Member = require("../model/memberSchema"); // Adjust the path as needed
const Watches = require("../model/watchSchema");
const getWatchesPage = async (req, res) => {
  const membername = req.cookies.membername || "Guest";
  const { query, brand } = req.query;
  let filter = {};

  if (query) {
    filter.watchName = { $regex: query, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
  }

  if (brand) {
    filter.brand = brand;
  }

  try {
    const watches = await Watches.find(filter).populate("brand"); // Đảm bảo rằng bạn populate để lấy thông tin brand
    const brands = await Brand.find(); // Lấy danh sách các nhãn hiệu (brand)
    res.render("watches", {
      watches,
      brands,
      query,
      selectedBrand: brand,
      membername,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const detailWatches = async (req, res) => {
  const membername = req.cookies.membername || "Guest";
  try {
    const { id } = req.params;
    const watch = await Watches.findById(id)
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      })
      .populate("brand");

    if (!watch) {
      return res.status(404).json({ message: "Watch not found" });
    }

    res.render("detailWatches", { watches: watch, membername });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { comment, rating } = req.body;
  const author = req.cookies.memberId; // Assuming memberId is stored in cookies
  console.log(`Received watch ID: ${id}`);

  try {
    const watch = await Watches.findById(id);
    if (!watch) {
      return res.status(404).json({ message: "Watch not found" });
    }

    // Kiểm tra xem thành viên đã đăng bình luận cho đồng hồ này chưa
    const existingComment = await Comment.findOne({ author, watch: id });
    if (existingComment) {
      return res
        .status(400)
        .json({ message: "You have already posted a comment for this watch" });
    }

    const newComment = new Comment({
      content: comment,
      rating,
      author,
      watch: watch._id, // Đảm bảo rằng bạn đang truyền đúng id của đồng hồ
    });

    await newComment.save();
    watch.comments.push(newComment);
    await watch.save();

    res.redirect(`/watches/${id}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const memberProfile = async (req, res) => {
  const membername = req.cookies.membername;

  if (!membername) {
    return res.render("memberProfile", { member: null, membername: "Guest" });
  }

  try {
    const member = await Member.findOne({ membername });

    if (!member) {
      return res.render("memberProfile", { member: null, membername: "Guest" });
    }

    res.render("memberProfile", { member, membername });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
const editProfilePage = async (req, res) => {
  const membername = req.cookies.membername;

  if (!membername) {
    return res.render("editProfile", { member: null, membername: "Guest" });
  }

  try {
    const member = await Member.findOne({ membername });

    if (!member) {
      return res.render("editProfile", { member: null, membername: "Guest" });
    }

    res.render("editProfile", { member, membername });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const updateProfile = async (req, res) => {
  const membername = req.cookies.membername;

  if (!membername) {
    return res.status(403).send("Unauthorized");
  }

  const { name, YOB, isAdmin } = req.body;

  try {
    const member = await Member.findOneAndUpdate(
      { membername },
      { name, YOB, isAdmin },
      { new: true }
    );

    if (!member) {
      return res.status(404).send("Member not found");
    }

    res.redirect("/member");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const changePassword = async (req, res) => {
  const membername = req.cookies.membername;

  if (!membername) {
    return res.status(403).send("Unauthorized");
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const member = await Member.findOne({ membername });

    if (!member) {
      return res.status(404).send("Member not found");
    }

    // So sánh mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, member.password);

    if (!isMatch) {
      return res.status(400).send("Current password is incorrect");
    }

    // Mã hóa mật khẩu mới trước khi lưu
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    member.password = hashedPassword;
    await member.save();

    res.redirect("/member");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getWatchesPage,
  detailWatches,
  addComment,
  memberProfile,
  updateProfile,
  editProfilePage,
  changePassword,
};
