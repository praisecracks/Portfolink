import axios from "axios";

export const generateDescription = async (prompt) => {
  try {
    const response = await axios.post(
      "https://portfolink-backend.onrender.com/ai",
      { prompt }
    );
    return response.data.description;
  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);
    return null;
  }
};
