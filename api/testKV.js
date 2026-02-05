import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    await kv.set("hello", "Redis is working 🚀");
    const value = await kv.get("hello");

    res.status(200).json({ message: value });
  } catch (err) {
    res.status(500).json({ error: "Redis connection failed" });
  }
}
