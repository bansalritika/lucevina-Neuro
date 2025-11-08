import jwt from "jsonwebtoken";
// import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's an admin
    let actor = await Admin.findById(decoded.id);
    // if (!actor) actor = await User.findById(decoded.id);
    // if (!actor) return res.status(404).json({ message: "User not found" });

    req.user = {
      _id: actor._id,
      role: actor.role || "user",
      email: actor.email,
      userName: actor.userName || actor.sponsorName || "",
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
