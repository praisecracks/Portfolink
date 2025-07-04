import axios from "axios";

export const generateDescription = async (prompt) => {
  try {
    const response = await axios.post(
      "https://portfolink-backend.onrender.com/generate", // ✅ Make sure this matches your backend route
      { prompt }
    );

    if (!response.data || !response.data.description) {
      throw new Error("No description returned from AI");
    }

    return response.data.description;
  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);
    return "";
  }
};
