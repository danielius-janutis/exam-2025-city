import {
  body,
  param,
  validationResult,
  matchedData,
} from "express-validator";

import * as User from "../models/User.js";

import bcryptjs from "bcryptjs";
import domainErrors from "../utils/domainErrors.js";

// JWT authentication
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;

import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

if (!JWT_SECRET) throw new Error("JWT_SECRET nėra nustatytas .env faile!");

// Passport JWT strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.selectById(jwt_payload.id);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export const isAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {   
    if (user) {
      req.user = user;
      return next();
    }
    return res
      .status(401)
      .json({ error: { status: 401, message: "Unauthorized"} });
  })(req, res, next);
};

export const isAdmin = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (user && user.roleId === 3) {
      req.user = user;
      return next();
    }
    return res
      .status(401)
      .json({ error: { status: 401, message: "Unauthorized"} });
  })(req, res, next);
};

export const isModerator = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (user && (user.roleId === 2 || user.roleId === 3)) {
      req.user = user;
      return next();
    }
    return res
      .status(401)
      .json({ error: { status: 401, message: "Unauthorized"} });
  })(req, res, next);
};


// imamas iš user_api.js
export { storeValidator as registerValidator } from "./user_api.js";

export const register = async (req, res, next) => {
  // surenkame ir validuojame duomenis
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return domainErrors.validation(res, validation.errors, "Duomenų klaida");
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
    message: "Vartotojas užregistruotas",
    id: insertId,
  });
};

export const loginValidator = () => [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email").escape(),
  body("password").trim().notEmpty().withMessage("Password is required").escape(),
];

export const login = async (req, res, next) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return domainErrors.validation(res, validation.errors, "Validation error");
  }

  const data = matchedData(req);

  const user = await User.selectByEmailWithRole(data.email);
  if (!user) {
    return domainErrors.authFailed(res, "Invalid credentials");
  }

  const match = await bcryptjs.compare(data.password, user.password);
  if (!match) {
    return domainErrors.authFailed(res, "Invalid credentials");
  }

  // create JWT
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1w" });

  // Return a minimal user object (do not include password)
  const safeUser = {
    id: user.id,
    userName: user.userName,
    email: user.email,
    roleId: user.roleId,
    roleName: user.roleName,
    roleTitle: user.roleTitle,
  };

  res.status(200).json({ status: "success", user: safeUser, token });
};
