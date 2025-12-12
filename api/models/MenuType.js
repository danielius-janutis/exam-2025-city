import db from "../db/mysql.js";

/**
 * Gauna visą meniu tipų sąrašą
 * @returns array|null
 */
export const selectAll = async () => {
  // paimame meniu tipų duomenis iš DB
  try {
    const [rows, fields] = await db.query("SELECT * FROM MenuType;");
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Gauna visą meniu tipų sąrašą su content type pavadinimais
 * @returns array|null
 */
export const selectAllWithContentType = async () => {
  // paimame meniu tipų duomenis iš DB
  try {
    const query = `
			SELECT mt.*, ct.name AS contentTypeName, ct.type AS contentType, ct.id AS contentTypeId
			FROM MenuType AS mt
			LEFT JOIN ContentType AS ct ON mt.id = ct.menuTypeId;
		`;

    const [rows, fields] = await db.query(query);
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Gauna meniu tipą pagal pateiktą id
 * @param {*} id
 * @returns [object]|null
 */
export const selectById = async (id) => {
  try {
    const [rows, fields] = await db.query(
      "SELECT * FROM MenuType WHERE id = ?;",
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
 * Įterpiama nauja meniu tipą
 * @param {*} data {name, title}
 * @returns int|null įterpto elemento id
 */
export const insert = async (data) => {
  try {
    const [result] = await db.query(
      "INSERT INTO MenuType (name, title) VALUES (?, ?);",
      [data.name, data.title]
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
 * Keičia meniu tipo duomenis
 * @param {*} id
 * @param {*} data {name, title}
 * @returns object|null
 */
export const update = async (id, data) => {
  try {
    const [result] = await db.query(
      "UPDATE MenuType SET name=?, title=? WHERE id=?;",
      [data.name, data.title, id]
    );

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Ištrina meniu tipą
 * @param {*} id
 * @returns object|null
 */
export const destroy = async (id) => {
  try {
    const [result] = await db.query("DELETE FROM MenuType WHERE id=?;", [id]);
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
