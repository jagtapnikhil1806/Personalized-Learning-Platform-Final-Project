const axios = require("axios");
require('dotenv').config();

exports.chatWithHF = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Use DialoGPT (free) or any other model
    const API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large";
    
    const response = await axios.post(
      API_URL,
      { 
        inputs: {
          text: message,
          past_user_inputs: context?.pastConversations || [],
          generated_responses: context?.pastBotReplies || []
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      }
    );

    res.json({
      reply: response.data.generated_text,
      context: response.data.conversation // Save for follow-up
    });

  } catch (error) {
    console.error("HF API Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "AI service unavailable",
      details: error.response?.data || null 
    });
  }
};