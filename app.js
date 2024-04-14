import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Swagger UI
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

// import routes
import attendeRoutes from './routes/attende.routes.js'

import { fileURLToPath } from "url";

// Path
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
// for body parser
app.use(express.json());
//for url params
app.use(express.urlencoded({ extended: true }));
//for image,files
app.use(express.static("public"));
// for cookies parsing and setting
app.use(cookieParser());
// Define route to serve the index.html file
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Send the index.html file
});

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5265", // Change this to your actual client's origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);


//Routes
app.use("/api/legendary-octo-events/attendee", attendeRoutes);

// Swagger UI
app.use(
  "/api/legendary-octo-events/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

export default app;
