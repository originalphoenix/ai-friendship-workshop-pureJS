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
  gotoListeningState();
  recognition.start();
}

/* Two states, listening, and ready */

function gotoListeningState() {
  const micListening = document.querySelector(".mic .listening");
  const micReady = document.querySelector(".mic .ready");

  micListening.style.display = "block";
  micReady.style.display = "none";
}

function gotoReadyState() {
  const micListening = document.querySelector(".mic .listening");
  const micReady = document.querySelector(".mic .ready");

  micListening.style.display = "none";
  micReady.style.display = "block";
}

/* Write a function to add the bot text */

function addBotItem(text) {
  const appContent = document.querySelector(".app-content");
  appContent.innerHTML += '<div class="item-container item-container-bot"><div class="item"><p>' + text + '</p></div></div>';
  startListening();
}

/* Write a function to add the user text */

function addUserItem(text) {
  const appContent = document.querySelector(".app-content");
  appContent.innerHTML += '<div class="item-container item-container-user"><div class="item"><p>' + text + '</p></div></div>';
}

/* Error Handling, if a user gets an error, prevent them from sending more info */

function addError(text) {
  addBotItem(text);
  const footer = document.querySelector(".app-footer");
  footer.style.display = "none";
}
