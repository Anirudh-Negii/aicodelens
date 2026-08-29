const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  const code = req.body.code;

  if (!code || !code.trim()) {
    return res.status(400).send("Code is required");
  }

  try {
    const response = await aiService.generateContent(code);
    res.send(response);
  } catch (error) {
    console.error("AI review failed:", error);
    res.status(500).send("Failed to generate code review");
  }
};
