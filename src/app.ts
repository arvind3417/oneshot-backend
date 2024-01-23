import express from "express";
import type {Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// utils
import { PORT, BASEURL } from "./constants";
import { httpResponse } from "./helpers";
import { connectDB } from "./db";

// middleware
import { routeNotFound } from "./middleware/routeNotFound";
import { errorHandler } from "./middleware/errorHandler";

// routes
import { authRouter } from "./routes/authRoutes";
import { blogRouter } from "./routes/blogRoutes";
import swaggerDocs from "./config/swagger/swagger";

// Use express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// // Routes
app.use(`${BASEURL}/auth`, authRouter);
app.use(`${BASEURL}/blog`, blogRouter);

swaggerDocs(app)


/**
 * @swagger
 * /ok:
 *   get:
 *     tags:
 *       - Healthcheck
 *     summary: Health Check
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
app.get("/api/ok", (_req, res) =>
  res.status(200).send(httpResponse(true, "OK", {}))
);
// Custom middleware
app.use(routeNotFound);
app.use(errorHandler);
export default app;

// const port = process.env.PORT || PORT;

// try {
//   // connect to database
//   if (!process.env.MONGO_URI)
//     throw new Error("No connection string found in .env file");
//   connectDB(process.env.MONGO_URI);

//   // Server setup
//   app.listen(port, () => {
//     console.log(`Server listening on -> PORT ${port}`);
//   });
// } catch (error) {
//   console.error(error);
// }
