const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const authMiddleware = require("./middlewares/authMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger");

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/", require("./routers/statusRouter"));
app.use("/auth", require("./routers/authRouter"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(authMiddleware);
// app.use(logMiddleware);

app.use("/usuarios", require("./routers/usuarioRouter"));
app.use("/aplicativos", require("./routers/aplicativoRouter"));
app.use("/sistema", require("./routers/sistemaRouter"));

app.use(errorMiddleware);

module.exports = app;
