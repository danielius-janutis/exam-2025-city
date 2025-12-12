import  * as User  from "../models/User.js";

import bcryptjs from "bcryptjs";
import domainErrors from "../utils/domainErrors.js";

import { body, param, validationResult, matchedData } from "express-validator";

// change password
export const changePasswordValidator = () => [
  param("id").toInt().isInt().withMessage("User ID is required"),
  body("currentPassword").trim().notEmpty().withMessage("Current password required").escape(),
  body("newPassword").trim().notEmpty().isLength({ min: 8 }).withMessage("New password must be at least 8 chars").escape(),
];

export const changePassword = async (req, res, next) => {
  // tikriname ar vartotojas gali matyti šį įrašą, ar tai jo informacija
  if (req.params.id != req.user.id && req.user.roleId !== 2) {
    return res
      .status(403)
      .json({ error: { status: 403, message: "Forbidden" } });
  }

  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return domainErrors.validation(res, validation.errors, "Validation error");
  }

  const { id: userId, currentPassword, newPassword } = req.body;

  const user = await User.selectById(userId);
  if (!user) return domainErrors.notFound(res, "User not found");

  const match = await bcryptjs.compare(currentPassword, user.password);
  if (!match) return domainErrors.authFailed(res, "Current password incorrect");

  const hashed = await bcryptjs.hash(newPassword, 10);
  const result = await User.updatePassword(userId, hashed);
  if (!result) return domainErrors.serverError(res, new Error("Failed to update password"));

  res.json({ status: "success", message: "Password updated" });
};

// vartotojų sąrašas
/**
 * Ištraukia vartotojų elementų sąrašą
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const index = async (req, res, next) => {
  try {
    // paimame visus vartotojus iš DB
    const users = await User.selectAllWithRole();

    // jei vartotojų sąrašas tuščias, grąžiname 404
    if (!users || users.length === 0) {
      return domainErrors.notFound(res, "Vartotojų įrašas nerastas");
    }

    // grąžiname vartotojų sąrašą
    res.json(users);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const idParamValidator = () => param("id").isInt();

// vartotojo įrašas
export const show = async (req, res, next) => {
  // tikriname ar vartotojas gali matyti šį įrašą, ar tai jo informacija
  if (req.params.id != req.user.id && req.user.roleId !== 2) {
    return res
      .status(403)
      .json({ error: { status: 403, message: "Forbidden" } });
  }

  // paimame vartotojo elementą pagal id, jei toks yra
  const validation = validationResult(req);

  // validacijos klaida
  if (!validation.isEmpty()) {
    return domainErrors.validation(res, validation.errors, "Duomenų klaida");
  }

  // gaunamas vartotojas pagal id
  let user_duomenys = await User.selectByIdWithRole(req.params.id);

  if (!user_duomenys) {
    res.status(404).json({ error: "Vartotojo įrašas nerastas" });
    return;
  }

  // grąžiname vartotojo duomenis  
  res.json(user_duomenys);

};

export const storeValidator = () => [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Vartotojo vardas yra privalomas")
    .escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El. paštas yra privalomas")
    .isEmail()
    .withMessage("Neteisingas el. pašto formatas")
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Slaptažodis yra privalomas")
    .isLength({ min: 8 })
    .withMessage("Slaptažodis turi būti bent 8 simbolių ilgio")
    // .matches(/\d/)
    // .withMessage("Slaptažodyje turi būti bent vienas skaičius")
    .escape(),
];

export const store = async (req, res, next) => {
  // surenkame ir validuojame duomenis
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
    return;
  }

  // surenkame validuotus duomenis iš užklausos
  const data = matchedData(req);

  // tikriname ar vartotojo vardas jau egzistuoja
  const existingUser = await User.selectByUserName(data.userName);
  if (existingUser) {
    return domainErrors.conflict(res, "Vartotojo vardas jau užregistruotas");
  }

  // tikriname ar vartotojo el. paštas jau egzistuoja
  const existingEmail = await User.selectByEmail(data.email);
  if (existingEmail) {
    return domainErrors.conflict(res, "El. paštas jau užregistruotas");
  }

  data.roleId = 1; // numatytasis roleId registracijai

  // šifruojame slaptažodį
  data.password = await bcryptjs.hash(data.password, 10);

  // įterpiame naują vartotoją į DB
  let insertId = await User.insert(data);

  if (!insertId) {
    return domainErrors.serverError(res, new Error("Nepavyko sukurti vartotojo"));
  }

  // grąžiname vartotojo id
  res.status(201).json({
    status: "success",
    message: "Vartotojas sukurtas",
    id: insertId,
  });
};

export const updateValidator = () => [
  param("id").isInt(),
  body("userName").trim().notEmpty().optional().escape(),
  body("email").trim().notEmpty().optional().isEmail().escape(),
  body("password").trim().notEmpty().optional().isLength({ min: 8 }).escape(),
];

export const update = async (req, res, next) => {
  // tikriname ar vartotojas gali matyti šį įrašą, ar tai jo informacija
  if (req.params.id != req.user.id && req.user.roleId !== 2) {
    return res
      .status(403)
      .json({ error: { status: 403, message: "Forbidden" } });
  }

  // paimame vartotojo elementą pagal id, jei toks yra
  const validation = validationResult(req);

  // validacijos klaida
  if (!validation.isEmpty()) {
    return domainErrors.validation(res, validation.errors, "Duomenų klaida");
  }

  // jei validacija ok, tikriname ar vartotojas egzistuoja
  let user_id = req.params.id;
  let user_duomenys = await User.selectById(user_id);

  if (!user_duomenys) {
    return domainErrors.notFound(res, "Vartotojo įrašas nerastas");
  }

  // surenkame validuotus duomenis iš užklausos
  const validatedData = matchedData(req);

  // surenkame naujus duomenis
  // jei duomenų nėra, paliekame senus
  const data = {};
  data.userName = validatedData.userName ?? user_duomenys.userName;
  data.email = validatedData.email ?? user_duomenys.email;
  data.password = validatedData.password ?? user_duomenys.password;

  // šifruojame slaptažodį
  data.password = await bcryptjs.hash(data.password, 10);

  // atnaujiname vartotojo įrašą
  let result = await User.update(user_id, data);

  if (!result) {
    return domainErrors.serverError(res, new Error("Nepavyko atnaujinti vartotojo"));
  }

  // grąžiname sėkmės pranešimą
  res.json({
    status: "success",
    message: "Vartotojo elementas sėkmingai pakeistas",
  });
};

export const updateRoleValidator = () => [
  param("id").isInt(),
  body("roleId").trim().notEmpty().isInt().escape(),
];

export const updateRole = async (req, res, next) => {
  
  // surenkame ir validuojame duomenis
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    res
      .status(400)
      .json({ message: "Duomenų klaida", errors: validation.errors });
    return;
  }

  // paimame vartotojo elementą pagal id, jei toks yra
  let user_id = req.params.id;
  let user_duomenys = await User.selectById(user_id);

  if (!user_duomenys) {
    return domainErrors.notFound(res, "Vartotojo įrašas nerastas");
  }

  // Paimame naują rolę
  let roleId = req.body.roleId;

  // Atnaujiname vartotojo rolę
  let result = await User.updateRole(user_id, roleId);

  if (!result) {
    return domainErrors.serverError(res, new Error("Nepavyko pakeisti vartotojo rolės"));
  }

  // grąžiname sėkmės pranešimą
  res.json({
    status: "success",
    message: "Vartotojo rolė sėkmingai pakeista",
  });

};

export const updateStatusValidator = () => [
  param("id").isInt(),
  body("status")
    .trim()
    .notEmpty()
    .isInt({ min: 0, max: 1 })
    .withMessage("Status must be 0 or 1")
    .escape(),
];

export const updateStatus = async (req, res, next) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return domainErrors.validation(res, validation.errors, "Duomenų klaida");
  }

  const userId = req.params.id;
  const user = await User.selectById(userId);

  if (!user) {
    return domainErrors.notFound(res, "Vartotojo įrašas nerastas");
  }

  const status = Number.parseInt(req.body.status, 10);

  const result = await User.updateStatus(userId, status);

  if (!result) {
    return domainErrors.serverError(res, new Error("Nepavyko pakeisti vartotojo būsenos"));
  }

  res.json({
    status: "success",
    message: "Vartotojo būsena sėkmingai pakeista",
  });
};

export const destroy = async (req, res, next) => {
  // paimame vartotojo elementą pagal id, jei toks yra
  const validation = validationResult(req);

  // validacijos klaida
  if (!validation.isEmpty()) {
    return domainErrors.validation(res, validation.errors, "Duomenų klaida");
  }

  // jei validacija ok, tikriname ar vartotojas egzistuoja
  let user_id = req.params.id;
  let user_duomenys = await User.selectById(user_id);

  if (!user_duomenys) {
    return domainErrors.notFound(res, "Vartotojo įrašas nerastas");
  }

  // triname vartotojo įrašą
  let result = await User.destroy(user_id);

  // jei nepavyko ištrinti
  if (!result) {
    return domainErrors.serverError(res, new Error("Nepavyko ištrinti vartotojo"));
  }

  // jei sėkmingai ištrinta
  res.json({
    status: "success",
    message: "Vartotojo elementas sėkmingai ištrintas",
  });

};
