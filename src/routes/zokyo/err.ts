/*
A file for handling errors spat out by the various LLM APIs.
For some reason, error codes are completely non-standard across the APIs, so that's handled here
*/

export type APIType = 'anthropic' | 'openai' | 'deepseek';

const ANTH_CODES = {
  413: "The request was too large. This means Zokyo's token split system is broken.",
  500: "There was an unspecified error from the Anthropic servers.",
  529: "The Anthropic servers are overloaded.",
}

const OPENAI_CODES = {
  429: "You've either reached a rate limit or a billing limit.",
  500: "There was an unspecified error from the Anthropic servers.",
  503: "The OpenAI servers are overloaded.",
}

const DS_CODES = {

}

const API_MAP: Record<APIType, Record<number, string>> = {
  'openai': OPENAI_CODES,
  'anthropic': ANTH_CODES,
  'deepseek': DS_CODES,
}

export const genErrorMessage = (apiType: APIType, statusCode: number) => {
  return API_MAP[apiType][statusCode];
}
