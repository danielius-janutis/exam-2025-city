import db from "../db/mysql.js";

/**
 * Gauna visą turinio tipų sąrašą
 * @returns array|null
 */
export const selectAll = async () => {
  // paimame turinio tipų duomenis iš DB
  try {
    const [rows, fields] = await db.query("SELECT * FROM ContentType;");
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Gauna turinio tipą pagal pateiktą id
 * @param {*} id
 * @returns [object]|null
 */
export const selectById = async (id) => {
  try {
    const [rows, fields] = await db.query(
      "SELECT * FROM ContentType WHERE id = ?;",
      [id]
    );
    if (rows.length) {
      return rows;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Įterpiama nauja turinio tipą
 * @param {*} data {name, type, menuTypeId}
 * @returns int|null įterpto elemento id
 */
export const insert = async (data) => {
  try {
    const [result] = await db.query(
      "INSERT INTO ContentType (name, type, menuTypeId) VALUES (?, ?, ?);",
      [data.name, data.type, data.menuTypeId]
    );

    if (result.insertId) {
      return result.insertId;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Keičia turinio tipo duomenis
 * @param {*} id
 * @param {*} data {name, type}
 * @returns object|null
 */
export const update = async (id, data) => {
  try {
    const [result] = await db.query(
      "UPDATE ContentType SET name=?, type=? WHERE id=?;",
      [data.name, data.type, id]
    );

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Ištrina turinio tipą
 * @param {*} id
 * @returns object|null
 */
export const destroy = async (id) => {
  try {
    const [result] = await db.query("DELETE FROM ContentType WHERE id=?;", [id]);
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
