import * as ContentType from "../models/ContentType.js";

import {
  body,
  param,
  validationResult,
  matchedData,
} from "express-validator";

// Turinio tipų sąrašas
/**
 * Ištraukia turinio tipų elementų sąrašą
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const index = async (req, res, next) => {
  const contentTypes = await ContentType.selectAll();

  if (!contentTypes) {
    res.status(500).json({ error: "Server error" });
    return;
  }

  res.json(contentTypes);
};

export const idParamValidator = () =>
  param("id").toInt().isInt().withMessage("Neteisingas ID");

// Turinio tipo įrašas
export const show = async (req, res, next) => {
  const validation = validationResult(req);
  // console.log(validation);

  if (!validation.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }

  let { id } = matchedData(req);

  let content_type = await ContentType.selectById(id);

  if (!content_type) {
    return res.status(404).json({ error: "Turinio tipo įrašas nerastas" });
  }

  res.json(content_type);
};

export const storeValidator = () => [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Pavadinimas yra privalomas")
    .escape(),
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Tipas yra privalomas")
    .escape()
    .isIn(["text", "image"])
    .withMessage("Neteisingas turinio tipas"),
  body("menuTypeId").toInt().isInt().withMessage("Neteisingas meniu tipo ID"),
];

export const store = async (req, res, next) => {
  // surenkame ir validuojame duomenis
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }

  let { name, type, menuTypeId } = matchedData(req);

  let insertId = await ContentType.insert({ name, type, menuTypeId });

  if (!insertId) {
    return res.status(500).json({ error: "Nepavyko įterpti turinio tipo" });
  }

  res.json({
    status: "success",
    message: "Turinio tipo elementas sukurtas",
    id: insertId,
  });
};

export const updateValidator = () => [
  param("id").toInt().isInt().withMessage("Neteisingas ID"),
  body("name").trim().optional().escape(),
  body("type")
    .trim()
    .optional()
    .escape()
    .isIn(["text", "image"])
    .withMessage("Neteisingas turinio tipas"),
];

export const update = async (req, res, next) => {
  // paimame turinio tipo elementą pagal id, jei toks yra
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }

  const { id } = matchedData(req);

  // tikriname ar yra toks įrašas
  let contentType = await ContentType.selectById(id);

  if (!contentType) {
    return res.status(404).json({ error: "Turinio tipo įrašas nerastas" });
  }

  let { name, type } = matchedData(req);

  name = name ? name : contentType.name;
  type = type ? type : contentType.type;
  // menuTypeId = menuTypeId ? menuTypeId : contentType.menuTypeId;

  let result = await ContentType.update(id, { name, type });

  if (!result) {
    return res.status(500).json({ error: "Nepavyko atnaujinti turinio tipo" });
  }

  res.json({
    status: "success",
    message: "Turinio tipo elementas sėkmingai pakeistas",
  });
};

export const destroy = async (req, res, next) => {
  // paimame turinio tipo elementą pagal id, jei toks yra
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }

  let { id } = matchedData(req);

  let contentType = await ContentType.selectById(id);

  if (!contentType) {
    return res.status(404).json({ error: "Turinio tipo įrašas nerastas" });
  }

  let result = await ContentType.destroy(id);

  if (!result) {
    return res.status(500).json({ error: "Nepavyko ištrinti turinio tipo" });
  }

  res.json({
    status: "success",
    message: "Turinio tipo elementas sėkmingai ištrintas",
  });
};
