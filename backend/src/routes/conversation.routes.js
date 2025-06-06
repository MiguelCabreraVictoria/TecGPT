import { conversation } from "../controllers/conversation.controller.js";
import { authToken } from "../middlewares/authToken.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/conversation", authToken, conversation);