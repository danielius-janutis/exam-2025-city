import * as Role from "../models/Role.js";

import { body, param, validationResult } from "express-validator";

// rolės sąrašas
/**
 * Ištraukia rolės elementų sąrašą
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const index = async (req, res, next) => {
  try {
    const roles = await Role.selectAll();
    if (roles) {
      res.json(roles);
    } else {
      res.status(404).json({ error: "Rolės įrašas nerastas" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
  // res.json(informacijos_sarasas);
  // res.json([]);
};

export const idParamValidator = () => param("id").isInt();

// rolės įrašas
export const show = async (req, res, next) => {
  const validation = validationResult(req);
  // console.log(validation);

  if (validation.isEmpty()) {
    let roles_duomenys = await Role.selectById(req.params.id);

    if (roles_duomenys) {
      res.json(roles_duomenys);
    } else {
      res.status(404).json({ error: "Rolės įrašas nerastas" });
    }
  } else {
    res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }
};

export const storeValidator = () => [
  body("name").trim().notEmpty().escape(),
  body("title").trim().notEmpty().escape(),
];

export const store = async (req, res, next) => {
  // surenkame ir validuojame duomenis
  const validation = validationResult(req);
  if (validation.isEmpty()) {
    const data = {};
    data.name = req.body.name;
    data.title = req.body.title;

    let insertId = await Role.insert(data);

    if (insertId) {
      res.json({
        status: "success",
        message: "Rolės elementas sukurtas",
        id: insertId,
      });
    } else {
      res.status(500).json({ error: "Nepavyko įterpti rolės" });
    }
  } else {
    res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }
};

export const updateValidator = () => [
  param("id").isInt(),
  body("name").trim().notEmpty().optional().escape(),
  body("title").trim().notEmpty().optional().escape(),
];

export const update = async (req, res, next) => {
  // paimame rolės elementą pagal id, jei toks yra
  const validation = validationResult(req);
  if (validation.isEmpty()) {

    let roles_id = req.params.id;
    let roles_duomenys = await Role.selectById(roles_id);

    if (roles_duomenys) {
      const data = {};
      data.name = req.body.name ?? roles_duomenys.name;
      data.title = req.body.title ?? roles_duomenys.title;

      let result = await Role.update(roles_id, data);

      if (result) {
        res.json({
          status: "success",
          message: "Rolės elementas sėkmingai pakeistas",
        });
      } else {
        res.status(500).json({ error: "Nepavyko įterpti rolės" });
      }
    } else {
      res.status(404).json({ error: "Rolės įrašas nerastas" });
    }
  } else {
    res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }
};

export const destroy = async (req, res, next) => {
  // paimame rolės elementą pagal id, jei toks yra
  const validation = validationResult(req);
  if (validation.isEmpty()) {
    let roles_id = req.params.id;
    let roles_duomenys = await Role.selectById(roles_id);

    if (roles_duomenys) {
      let result = await Role.destroy(roles_id);

      if (result) {
        res.json({
          status: "success",
          message: "Rolės elementas sėkmingai ištrintas",
        });
      } else {
        res.status(500).json({ error: "Nepavyko ištrinti rolės" });
      }
    } else {
      res.status(404).json({ error: "Rolės įrašas nerastas" });
    }
  } else {
    res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
  }
};
