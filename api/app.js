import createError from "http-errors";
import express from "express";
import path from "path";
import cors from "cors";

const port = process.env.PORT || 3000;
const app = express();

// app.use(cors());
// var allowedOrigins = ['http://localhost:81', // admin panelė dev režimu
//                       'http://localhost:80'];

// app.use(cors({
//   origin: function(origin, callback){
//     // allow requests with no origin 
//     // (like mobile apps or curl requests)
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));

app.use(cors());

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// .env nuskaitymas iš failo
import dotenv from "dotenv";
dotenv.config();

import indexRouter from "./routes/index.js";
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, '0.0.0.0', () => {
  console.log("Serveris veikia");
});
