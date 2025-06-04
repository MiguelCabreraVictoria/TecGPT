import axios from "axios";

export const conversation = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        // Llama al modelo externo (reemplaza "url" por la URL real)
        const modelResponse = await axios.post("url", { prompt });

        res.json({ response: modelResponse.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Fail" });
    }
}