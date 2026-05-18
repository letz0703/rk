#!/usr/bin/env node

import { GoogleGenerativeAI } from '@google/generative-ai';
import readline from 'readline';

const API_KEY = 'AIzaSyCgU2ZPQmPV391XGXWWYn4x5DJnjYDWEHY';
const genAI = new GoogleGenerativeAI(API_KEY);

async function chatWithGemini() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('🤖 Gemini Code Chat (type "exit" to quit)\n');

  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      try {
        const result = await chat.sendMessage(input);
        const response = await result.response;
        console.log(`\nGemini: ${response.text()}\n`);
      } catch (error) {
        console.error('Error:', error.message);
      }

      askQuestion();
    });
  };

  askQuestion();
}

chatWithGemini().catch(console.error);