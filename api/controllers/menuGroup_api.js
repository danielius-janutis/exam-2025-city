import * as MenuGroup from "../models/MenuGroup.js";

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
  const menuGroups = await MenuGroup.selectAll();

  if (!menuGroups) {
    return res.status(404).json({ error: "Grupės įrašas nerastas" });
  }

  res.json(menuGroups);
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

  const menuGroup = await MenuGroup.selectById(req.params.id);

  if (!menuGroup) {
    return res.status(404).json({ error: "Grupės įrašas nerastas" });
  }

  res.json(menuGroup);
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

  const insertId = await MenuGroup.insert({ name, title });

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

  const menuGroup = await MenuGroup.selectById(id);

  if (!menuGroup) {
    return res.status(404).json({ error: "Meniu grupės įrašas nerastas" });
  }

  let { name, title } = matchedData(req);

  name = name ?? menuGroup.name;
  title = title ?? menuGroup.title;

  const result = await MenuGroup.update(id, { name, title });

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

  const menuGroup = await MenuGroup.selectById(id);

  if (!menuGroup) {
    return res.status(404).json({ error: "Meniu grupės įrašas nerastas" });
  }

  const result = await MenuGroup.destroy(id);

  if (!result) {
    return res.status(500).json({ error: "Nepavyko ištrinti meniu grupės" });
  }

  res.json({
    status: "success",
    message: "Grupės elementas sėkmingai ištrintas",
  });
};
