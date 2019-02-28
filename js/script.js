/* Add all the speech recognition stuff */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
let recognizedText = null;

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.continuous = false;
recognition.onstart = function() {
  recognizedText = null;
};

/* Write Synth Voice */

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

/* Write a function that starts listening triggering the recognition function, and the listening function */

function startListening() {
}

/* Two states, listening, and ready */

function gotoListeningState() {
}

function gotoReadyState() {
}

/* Write a function to add the bot text */

function addBotItem(text) {
}

/* Write a function to add the user text */

function addUserItem(text) {
}

/* Error Handling, if a user gets an error, prevent them from sending more info */

function addError(text) {
}
