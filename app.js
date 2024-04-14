import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Swagger UI
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

// import routes
import attendeRoutes from './routes/attende.routes.js'

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
app.use(cors());
//Server Working
app.get("/", (_, res) => {
  res.send("HLO");
});

//Routes
app.use("/api/legendry-octo-events/attendee", attendeRoutes);

// Swagger UI
app.use(
  "/api/shiny-barnacle/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

export default app;
