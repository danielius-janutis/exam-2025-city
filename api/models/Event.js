import db from "../db/mysql.js";

/**
 * Gauna visą grupiu sąrašą
 * @returns array|null
 */
export const selectAll = async () => {
  // paimame grupiu duomenis iš DB
  try {
    const [rows, fields] = await db.query("SELECT * FROM Menu;");
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Gauna grupe pagal pateiktą id
 * @param {*} id
 * @returns [object]|null
 */
export const selectById = async (id) => {
  try {
    const [rows, fields] = await db.query("SELECT * FROM Menu WHERE id = ?;", [
      id,
    ]);
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
 * Įterpiama nauja grupe
 * @param {*} data {name, title}
 * @returns int|null įterpto elemento id
 */
export const insert = async (data) => {
  try {
    const [result] = await db.query(
      "INSERT INTO Menu (name, title) VALUES (?, ?);",
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
 * Keičia grupes duomenis
 * @param {*} id
 * @param {*} data {name, title}
 * @returns object|null
 */
export const update = async (id, data) => {
  try {
    const [result] = await db.query(
      "UPDATE Menu SET name=?, title=? WHERE id=?;",
      [data.name, data.title, id]
    );

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Ištrina grupe
 * @param {*} id
 * @returns object|null
 */
export const destroy = async (id) => {
  try {
    const [result] = await db.query("DELETE FROM Menu WHERE id=?;", [id]);
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Gauna visas meniu grupes ir jų meniu punktus
 * @returns array|null
 */
export const selectAllWithGroupAndType = async () => {
  try {
    const [rows, fields] = await db.query(`
			SELECT 
				mi.*, 
				mg.id as groupId, mg.name as groupName, mg.title as groupTitle, 
				mt.id as typeId, mt.name as typeName, mt.title as typeTitle
			FROM MenuGroup as mg
			LEFT JOIN Menu as mi ON mg.id = mi.menuGroupId
			LEFT JOIN MenuType as mt ON mi.menuTypeId = mt.id
			ORDER BY mg.id, mi.orderNo
		;`);
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Keičia meniu punktų vietomis
export const changeMenuItemOrder = async (id, group, orderNo, groupId) => {
  try {
    // padidina visų meniu punktų eiliškumo numerį naujoje grupėje, kurie yra lygūs arba didesni už naująjį
    await db.query(
      "UPDATE Menu SET orderNo=orderNo+1 WHERE menuGroupId=? AND orderNo>?",
      [groupId, orderNo]
    );

    // atnaujiname meniu punkto grupę ir eiliškumo numerį
    const [result] = await db.query(
      "UPDATE Menu SET menuGroupId=?, orderNo=? WHERE id=?;",
      [groupId, orderNo + 1, id]
    );

    // // perrikiuoja senuosiuose meniu punktuose eiliškumo numerius
    await db.query("SET @row_number = 0;", []);
    await db.query(
      "UPDATE Menu SET orderNo = (@row_number:=@row_number + 1) WHERE menuGroupId=? ORDER BY orderNo;",
      [group]
    );

    // // perrašo eiliškumo numerius naujoje grupėje
    await db.query("SET @row_number = 0;", []);
    await db.query(
      "UPDATE Menu SET orderNo = (@row_number:=@row_number + 1) WHERE menuGroupId=? ORDER BY orderNo;",
      [groupId]
    );

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
