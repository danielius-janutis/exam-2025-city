import db from "../db/mysql.js";

export const insert = async (data) => {
  try {
    const [result] = await db.query(
      "INSERT INTO PasswordReset (userId, token, expiresAt) VALUES (?, ?, ?);",
      [data.userId, data.token, data.expiresAt]
    );
    return result.insertId ? result.insertId : null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const findByToken = async (token) => {
  try {
    const [rows] = await db.query("SELECT * FROM PasswordReset WHERE token = ?;", [token]);
    return rows.length ? rows[0] : null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteById = async (id) => {
  try {
    const [result] = await db.query("DELETE FROM PasswordReset WHERE id = ?;", [id]);
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
