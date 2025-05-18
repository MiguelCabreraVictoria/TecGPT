import authRoutes from "./routes/auth.routes.js";
import express from "express";
import morgan from "morgan";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);

export default app;
