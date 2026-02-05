export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question, context } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: `You are a friendly AI health assistant.
Screen: ${context.screen}
Sleep: ${context.sleep}
Stress: ${context.stress}
Give short, helpful advice.`
              }
            ]
          },
          {
            role: "user",
            content: [{ type: "text", text: question }]
          }
        ]
      })
    });

    const data = await response.json();

    const aiText =
      data.output?.[0]?.content?.find(c => c.type === "output_text")?.text;

    res.status(200).json({ reply: aiText || "No AI response" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
}
