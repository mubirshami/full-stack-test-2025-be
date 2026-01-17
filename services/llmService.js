const simulateLLMCall = async (userMessage) => {
  const delay = Math.floor(Math.random() * 10000) + 10000;

  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        "This is a simulated AI response that demonstrates how the backend handles long-running LLM requests. The response includes multiple sentences to show how the frontend can handle delayed output gracefully. In a real implementation, this would come from an actual LLM service like OpenAI's API. The backend ensures that this delay does not block other requests, allowing the system to remain responsive even while processing chat messages.",
        
        "Here's another example of a simulated AI response. This demonstrates the async handling capabilities of the backend service. The random delay between 10-20 seconds simulates real-world LLM processing times. The frontend must be designed to handle these delays gracefully, showing loading states and preventing duplicate message sends. This approach ensures a realistic user experience similar to actual ChatGPT interactions.",
        
        "The LLM service abstraction allows for easy integration with real LLM providers in the future. By structuring the code as if making real HTTP requests, we maintain clean separation of concerns. The simulated responses are longer and more detailed to properly test the frontend's ability to handle substantial text output. This pattern is commonly used in development and testing environments.",
        
        "When implementing a real LLM integration, you would replace this simulation with actual API calls to services like OpenAI, Anthropic, or other providers. The structure remains the same - async handling, proper error management, and non-blocking request processing. The key is maintaining the same interface so that switching from simulation to real API calls requires minimal code changes.",
        
        "This response demonstrates the importance of proper async/await patterns in Node.js applications. By using Promises and setTimeout, we simulate network latency and processing time without blocking the event loop. This ensures that other API requests can be processed concurrently, maintaining system responsiveness. The frontend should implement proper loading states and error handling to provide a smooth user experience."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      resolve({
        message: randomResponse,
        delay: delay / 1000,
      });
    }, delay);
  });
};

module.exports = {
  simulateLLMCall,
};
