const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// app.use("/auth", require("./routers/authRouter"));

// app.use(authMiddleware);
// app.use(logMiddleware);

app.use("/usuarios", require("./routers/usuarioRouter"));

// app.use(errorMiddleware);

module.exports = app;
