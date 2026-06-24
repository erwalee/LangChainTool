// Intializing the model

import 'dotenv/config';
import { ChatOpenRouter } from "@langchain/openrouter";

const model = new ChatOpenRouter({
    model: "cohere/north-mini-code:free",
    apiKey: process.env.OPENROUTER_API_KEY,
});


// Chain Example 1 - Gaming
const step1 = await model.invoke("If I am buying a computer which is better between Ryzen and Intel CPUs ")
const step2 = await model.invoke(
    `If I instead build a PC using: "${step1.content}". 
     Explain the pros and cons of each pairing.`
);
const step3 = await model.invoke(`Based on the build from: "${step2.content}" what is the most cost effective PC?`);

console.log("Better CPU:", step1.content);
console.log("Pros and Cons:", step2.content);
console.log("Cost effective:", step3.content);

// Plan, then Execute
const planReponse = await model.invoke(`As an AI helper, a user wants to find the
    best chocolate chip cookie.
    Produce a JSON array of 3 parts. Respond ONLY with valid JSON
    DO NOT PROVIDE ANY EXPLANATIONS 
    Here is an example format:
    ["List of ingredients","Preperation and Measurements", "Instructions:"]`
);

// Parse
const steps = JSON.parse(planReponse.content);
console.log("Cookie Recipe:", steps);

// Execute each step
const results = [];
for(const step of steps){
    const result = await model.invoke(`You are a baking expert. Please write a detailed section for a chocolate chip cookie recipe for this part: ${step}`
    );

    results.push(result.content);
}

console.log("\nFull Cookie Recipe:\n", results.join("\n\n"));