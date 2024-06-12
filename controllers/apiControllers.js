const Watches = require("../model/watchSchema");
const getAllWatches = async (req, res) => {
  try {
    const watches = await Watches.find({});
    return res.status(200).json({ message: "OK", data: watches });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  getAllWatches,
};
