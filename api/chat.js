export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        reply: "❌ OpenAI API key not found"
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
            content:
              "You are an AI health assistant. Give short, clear, friendly health advice."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // 🔴 DEBUG LOG (VERY IMPORTANT)
    console.log("OPENAI RESPONSE:", JSON.stringify(data));

    if (!data.choices || !data.choices[0]) {
      return res.status(200).json({
        reply: "❌ OpenAI returned no choices"
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      reply: "❌ Server crashed"
    });
  }
}
