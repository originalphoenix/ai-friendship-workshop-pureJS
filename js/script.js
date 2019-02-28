// const socket = io();


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
  synthVoice(text);
  appContent.innerHTML += '<div class="item-container item-container-bot"><div class="item"><p>' + text + '</p></div></div>';
  appContent.scrollTop = appContent.scrollHeight; // scroll to bottom
  startListening();
}

/* Write a function to add the user text */

function addUserItem(text) {
  const appContent = document.querySelector(".app-content");
  appContent.innerHTML += '<div class="item-container item-container-user"><div class="item"><p>' + text + '</p></div></div>';
  appContent.scrollTop = appContent.scrollHeight; // scroll to bottom
}

/* Error Handling, if a user gets an error, prevent them from sending more info */

function addError(text) {
  addBotItem(text);
  const footer = document.querySelector(".app-footer");
  footer.style.display = "none";
}

/* Wait until the page is loaded to start doing stuff */


document.addEventListener("DOMContentLoaded", function(event) {

  /* load the API.AI client as a variable, pass your dev Access Token */
  const apiClient = new ApiAi.ApiAiClient({accessToken: '7391b4c2f8e341c4a7772498504a100a'});

  /* Load something first with the botItem text */
  addBotItem("Hello! I am a robot backed by Google, all your data are belong to us. =^_^=");

  /* Start a huge function, that takes the recognition result and starts the function to get the bot */

  recognition.onresult = function(ev) {
    recognizedText = ev["results"][0][0]["transcript"];

    /* Trigger the addUserItem with the text to show that their speech was recognized */
    addUserItem(recognizedText);
    // socket.emit('chat message', recognizedText);

    /* Start the API.ai Magic with a promise */
    let promise = apiClient.textRequest(recognizedText);

    promise
        .then(handleResponse)
        .catch(handleError);

    /* Write a function to handle the response from api.ai */
    function handleResponse(serverResponse) {

      // Set a timer just in case. so if there was an error speaking or whatever, there will at least be a prompt to continue
      var timer = window.setTimeout(function() { startListening(); }, 5000);

      /* Digest the response, it comes in a huge JSON, so I'm sure there are much nicer ways to do this */
      const speech = serverResponse["result"]["fulfillment"]["speech"];

      /* If it's a fancy response, trigger the fancy times */
      if (serverResponse["result"]["fulfillment"]["messages"].length > 1) {
      const inspiration = serverResponse["result"]["fulfillment"]["messages"][1]["payload"]["inspirationVideo"]
        document.getElementById('video-background').setAttribute("src", inspiration);
        document.getElementById('video-background').style.display = "block";
      }

      /* Make sure to display the speech in the bubble and trigger robot times*/
      addBotItem(speech);
    }
    /* Error Handling */
    function handleError(serverError) {
      console.log("Error from api.ai server: ", serverError);
    }
  };

/*   socket.on('bot reply', function(replyText) {
    if(replyText == '') replyText = '(No answer...)';
    synthVoice(replyText);
    addBotItem(replyText);
  }); */

  /* Recognition error handling */

  recognition.onerror = function(ev) {
    console.log("Speech recognition error", ev);
  };

  /* Make sure to go back to listening once we're done */
  recognition.onend = function() {
    gotoReadyState();
  };

  const startButton = document.querySelector("#start");
  startButton.addEventListener("click", function(ev) {
    startListening();
    ev.preventDefault();
  });

});
