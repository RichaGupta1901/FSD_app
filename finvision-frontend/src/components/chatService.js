// export async function talkToChatbot(userMessage) {
//     const response = await fetch("https://api.dify.ai/v1/chat-messages", {
//       method: "POST",
//       headers: {
//         "Authorization": "Bearer YOUR_DIFY_API_KEY",  // 🔑 Replace with your real key
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         inputs: {},
//         query: userMessage
//       })
//     });
  
//     const data = await response.json();
//     return data.answer || "🤖 No response from chatbot.";
//   }
  