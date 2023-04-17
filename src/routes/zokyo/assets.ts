// Just a file for keeping random non-important stuff like phrases

const passwordMessages = [
  "Incorrect password. Please try again.",
  "Sorry, that password is incorrect. Please try again.",
  "Incorrect login credentials. Please check your password and try again.",
  "Your password is incorrect. Please try again.",
  "Sorry, we couldn't verify your password. Please try again.",
  "Your password does not match our records. Please try again.",
  "That password isn't right. Please try again."
];

export const getPassMsg = () => {
  const randomIndex = Math.floor(Math.random() * passwordMessages.length);
  return passwordMessages[randomIndex];
}

const userNotFoundMessages = [
  "User not found. Please check your credentials and try again.",
  "Sorry, we couldn't find that user. Please try again.",
  "We couldn't find a user with that username or email. Please try again.",
  "The username or email you entered is not registered. Please try again.",
  "We're sorry, that user doesn't exist. Please check your input and try again."
];

export const getUserNotFoundMsg = () => {
  const randomIndex = Math.floor(Math.random() * userNotFoundMessages.length);
  return userNotFoundMessages[randomIndex];
}
