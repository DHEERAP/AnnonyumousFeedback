

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(req: Request) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const url = new URL(req.url);
    const topic = url.searchParams.get("topic");

    let prompt;

    if (topic) {
      // Use the topic provided by the user
      prompt = `each time give me a new response only give answers in 20 words each separated by "||" minium 10 response || "${topic}"`;
    } else {
      // Default prompt if no topic is provided
      prompt = `each time give me a new response only give answers in 20 words each separated by "||" || "What motivates you to achieve your goals?" || "How do you handle criticism?" || "Describe a challenging situation and how you overcame it." || "If you could learn any skill instantly, what would it be?" || "What is your greatest strength and greatest weakness?" || "How do you prioritize tasks when you’re overwhelmed?" || "What does success mean to you?" || "How would you describe your ideal work environment?" || "Who has inspired you the most in your life?" || "What would you do if you had unlimited resources for a day?" || "How do you stay updated with the latest industry trends?" || "What do you enjoy doing in your free time?" || "If you could change one thing about the world, what would it be?"`;
    }

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return Response.json({
      success: true,
      message: result.response.text(),
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error generating text", error);
    return Response.json(
      {
        success: false,
        message: "Error generating messages",
      },
      { status: 500 }
    );
  }
}