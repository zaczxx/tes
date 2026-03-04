export default {
  async fetch(request, env, ctx) {
    const BOT_TOKEN = "8682352180:AAF-FZmmqmthG-_x0LoJ5qxM0W2y9DPLNZ0";
    const GEMINI_API_KEY = "AIzaSyCWg6WaBFbpk0jcUKz6ZfON_Cc9N0xfuzo";

    if (request.method === "POST") {
      const payload = await request.json();

      if (payload.message && payload.message.text) {
        const chatId = payload.message.chat.id;
        const userText = payload.message.text;

        // 1. Tembak API Gemini AI
        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userText }] }]
          })
        });

        const aiData = await aiResponse.json();
        const balasanAI = aiData.candidates[0].content.parts[0].text || "Duh, otak gue lagi nge-hang, Kimak!";

        // 2. Kirim balik ke Telegram User
        ctx.waitUntil(
          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: balasanAI
            })
          })
        );
      }
      return new Response("OK", { status: 200 });
    }
    return new Response("Bot AI Ready!", { status: 200 });
  }
};
