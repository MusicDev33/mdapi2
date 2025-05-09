/*
In the spirit of having way too many files in here, I'm adding this too. This is where I'll have the code for the various chat engines.
I've noticed a lot of similarities between the engines, so if this ends up being less than a hundred lines, maybe I'll move it back.
*/
import { encode } from 'gpt-3-encoder';
import { countTokens } from '@anthropic-ai/tokenizer';

// Token Counting
type TokenCountFunc = (messages: any[], threshold: number) => boolean;
export type ChatEngine = 'chatgpt' | 'claude' | 'deepseek';

const tokenCountValidOpenAi: TokenCountFunc = (messages: any[], threshold: number) => {
  let total = 0;

  for (let message of messages) {
    total += encode(message.content).length;
  }

  if (total > threshold) {
    return false;
  }

  return true;
}

const tokenCountValidClaude: TokenCountFunc = (messages: any[], threshold: number) => {
  let total = 0;

  for (let message of messages) {
    total += countTokens(message.content);
  }

  if (total > threshold) {
    return false;
  }

  return true;
}

const tokenCountValidDeepSeek: TokenCountFunc = (messages: any[], threshold: number) => {
  let total = 0;

  for (let message of messages) {
    total += countTokens(message.content);
  }

  if (total > threshold) {
    return false;
  }

  return true;
}

export const tokenCountDict: Record<ChatEngine, TokenCountFunc> = {
  'chatgpt': tokenCountValidOpenAi,
  'claude': tokenCountValidClaude,
  'deepseek': tokenCountValidDeepSeek
}
