import axios from "axios";
import logger from '../utils/logger'
import { response } from "express";

export const conversation = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const userID = req.user?.userId;
        logger.activityLogger.info(`User ${userId} sent prompt: ${prompt}`);
        // Llama al modelo externo (reemplaza "url" por la URL real)
        const modelResponse = await axios.post("172.20.100.2:8000", { prompt });
        logger.gptLogger.info(`Response: ${prompt}`);

        res.json({ response: modelResponse.data });
    } catch (error) {
        logger.gptLogger(`Error to connect to GPT`)
        res.status(500).json({ error: "Fail" });
    }
}