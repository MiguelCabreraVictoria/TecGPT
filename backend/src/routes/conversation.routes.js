import { conversation } from "../controllers/conversation.controller.js";
import { Router } from "express";

const router = Router();

router.post("/conversation", conversation);