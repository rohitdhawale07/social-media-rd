import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);

    // Check if the user exists
    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Provide default values for missing fields
    const name = req.body.name || "";
    const city = req.body.city || "";
    const website = req.body.website || "";
    const profilePic = req.body.profilePic || "";
    const coverPic = req.body.coverPic || "";

    if (!name) {
      return res.status(400).json({ error: "Name cannot be empty." });
    }
    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        name,
        city,
        website,
        coverPic,
        profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};
