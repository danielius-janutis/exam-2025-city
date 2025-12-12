import * as Menu from "../models/Event.js";

import {
  body,
  param,
  validationResult,
  matchedData,
} from "express-validator";

// Grupių sąrašas
/**
 * Ištraukia grupių elementų sąrašą
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const index = async (req, res, next) => {
  const menus = await Menu.selectAll();

  if (!menus) {
    return res.status(404).json({ error: "Meniu įrašas nerastas" });
  }

  res.json(menus);
};

export const idParamValidator = () =>
  param("id").toInt().isInt().withMessage("Neteisingas ID");

// Grupės įrašas
export const show = async (req, res, next) => {
  const validation = validationResult(req);
  // console.log(validation);

  if (!validation.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }

  const menu = await Menu.selectById(req.params.id);

  if (!menu) {
    return res.status(404).json({ error: "Grupės įrašas nerastas" });
  }

  res.json(menu);
};

export const storeValidator = () => [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Pavadinimas yra privalomas")
    .escape(),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Antraštė yra privaloma")
    .escape(),
];

export const store = async (req, res, next) => {
  // surenkame ir validuojame duomenis
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }

  const { name, title } = matchedData(req);

  const insertId = await Menu.insert({ name, title });

  if (!insertId) {
    return res.status(500).json({ error: "Nepavyko įterpti meniu grupės" });
  }

  res.json({
    status: "success",
    message: "Meniu grupės elementas sukurtas",
    id: insertId,
  });
};

export const updateValidator = () => [
  param("id").toInt().isInt().withMessage("Neteisingas ID"),
  body("name").trim().optional().escape(),
  body("title").trim().optional().escape(),
];

export const update = async (req, res, next) => {
  // paimame grupės elementą pagal id, jei toks yra
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }

  const { id } = matchedData(req);

  const menu = await Menu.selectById(id);

  if (!menu) {
    return res.status(404).json({ error: "Meniu grupės įrašas nerastas" });
  }

  let { name, title } = matchedData(req);

  name = name ?? menu.name;
  title = title ?? menu.title;

  const result = await Menu.update(id, { name, title });

  if (!result) {
    return res.status(500).json({ error: "Nepavyko atnaujinti meniu grupės" });
  }

  res.json({
    status: "success",
    message: "Meniu grupės elementas sėkmingai pakeistas",
  });
};

export const destroy = async (req, res, next) => {
  // paimame grupės elementą pagal id, jei toks yra
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }

  const { id } = matchedData(req);

  const menu = await Menu.selectById(id);

  if (!menu) {
    return res.status(404).json({ error: "Meniu grupės įrašas nerastas" });
  }

  const result = await Menu.destroy(id);

  if (!result) {
    return res.status(500).json({ error: "Nepavyko ištrinti meniu grupės" });
  }

  res.json({
    status: "success",
    message: "Grupės elementas sėkmingai ištrintas",
  });
};


// Gaunamas visas meniu su meniu punktais
export const allMenuWithGroupAndType = async (req, res, next) => {
  const menus = await Menu.selectAllWithGroupAndType();

  if (!menus) {
    return res.status(404).json({ error: "Meniu įrašas nerastas" });
  }

  // sugrupuoja meniu pagal meniu grupes
  const groupedMenus = {};
  
  for (const menu of menus) {
    const group = groupedMenus[menu.menuGroupId] || {
       id: menu.groupId, 
       name: menu.groupName, 
       title: menu.groupTitle, 
       menuItems: [] 
    };

    const groupId = menu.groupId;
    delete menu.groupId;
    delete menu.groupName;
    delete menu.groupTitle;

    if (menu.id !== null) {
      group.menuItems.push(menu);
    }

    groupedMenus[groupId] = group;
  }

  res.json(groupedMenus);
};

// keičia meniu punktus vietomis
export const changeMenuItemOrderValidator = () => [
  body("id").toInt().isInt().withMessage("Neteisingas meniu punkto ID"),
  body("group").toInt().isInt().withMessage("Neteisingas esamos grupės ID"),
  body("orderNo").toInt().isInt().withMessage("Neteisingas naujas eiliškumo numeris"),
  body("groupId").toInt().isInt().withMessage("Neteisingas naujos grupės ID"),
];

export const changeMenuItemOrder = async (req, res, next) => {
  // surenkame ir validuojame duomenis
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }
  const { id, group, orderNo, groupId } = matchedData(req);

  const result = await Menu.changeMenuItemOrder(id, group, orderNo, groupId);
  if (!result) {
    return res.status(500).json({ error: "Nepavyko pakeisti meniu punkto eiliškumo" });
  }

  res.json({
    status: "success",
    message: "Meniu punkto eiliškumas sėkmingai pakeistas",
  });
};