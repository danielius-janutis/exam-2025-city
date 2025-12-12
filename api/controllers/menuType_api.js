import * as MenuType from "../models/MenuType.js";

import {
  body,
  param,
  validationResult,
  matchedData,
} from "express-validator";

// Meniu tipų sąrašas
/**
 * Ištraukia meniu tipų elementų sąrašą
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const index = async (req, res, next) => {
  const menuTypes = await MenuType.selectAllWithContentType();

  if (!menuTypes) {
    res.status(500).json({ error: "Server error" });
    return;
  }

  // sugrupuoja content type pagal menu type
  const groupedMenuTypes = {};

  menuTypes.forEach((item) => {
    const { id, name, title, contentTypeName, contentType, contentTypeId } = item;
    if (!groupedMenuTypes[id]) {
      groupedMenuTypes[id] = { id, name, title, contentTypes: [] };
    }

    if (contentTypeName) {
      groupedMenuTypes[id].contentTypes.push({
        name: contentTypeName,
        type: contentType,
        id: contentTypeId,
      });
    }
  });

  res.json(groupedMenuTypes);
};

export const idParamValidator = () =>
  param("id").toInt().isInt().withMessage("Neteisingas ID");

// Meniu tipo įrašas
export const show = async (req, res, next) => {
  const validation = validationResult(req);
  // console.log(validation);

  if (!validation.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }

  let { id } = matchedData(req);

  let menu_type = await MenuType.selectById(id);

  if (!menu_type) {
    return res.status(404).json({ error: "Grupės įrašas nerastas" });
  }

  res.json(menu_type);
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

  let { name, title } = matchedData(req);

  let insertId = await MenuType.insert({ name, title });

  if (!insertId) {
    return res.status(500).json({ error: "Nepavyko įterpti meniu tipo" });
  }

  res.json({
    status: "success",
    message: "Meniu tipo elementas sukurtas",
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

  // tikriname ar yra toks įrašas
  let menuType = await MenuType.selectById(id);

  if (!menuType) {
    return res.status(404).json({ error: "Meniu tipo įrašas nerastas" });
  }

  let { name, title } = matchedData(req);

  name = name ?? menuType.name;
  title = title ?? menuType.title;

  let result = await MenuType.update(id, { name, title });

  if (!result) {
    return res.status(500).json({ error: "Nepavyko atnaujinti meniu tipo" });
  }

  res.json({
    status: "success",
    message: "Meniu tipo elementas sėkmingai pakeistas",
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

  let { id } = matchedData(req);

  let menuType = await MenuType.selectById(id);

  if (!menuType) {
    return res.status(404).json({ error: "Meniu tipo įrašas nerastas" });
  }

  let result = await MenuType.destroy(id);

  if (!result) {
    return res.status(500).json({ error: "Nepavyko ištrinti meniu tipo" });
  }

  res.json({
    status: "success",
    message: "Grupės elementas sėkmingai ištrintas",
  });
};
