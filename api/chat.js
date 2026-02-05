export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a friendly AI health assistant. Give short practical advice."
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    const data = await openaiRes.json();

    // ✅ THIS LINE IS THE KEY
    const aiReply = data.choices?.[0]?.message?.content;

    return res.status(200).json({
      reply: aiReply || "AI could not generate a response."
    });

  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({
      reply: "AI server error"
    });
  }
}
