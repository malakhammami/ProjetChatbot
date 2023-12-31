var BTN=document.querySelector("#sendBtn")
var TEXTAREA=document.querySelector("#textSpeech")
var DIV=document.querySelector("#reponse_msg")
var BTN_MIC=document.querySelector("#bMic")
var SPINNER=document.querySelector("#spinnerr")
var history = []
//var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true; // Obtenez les résultats intermédiaires
recognition.lang = 'en-US';
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;
//EVENEMENT
BTN.addEventListener("click", chatBot)
BTN_MIC.addEventListener("click", speechToText)
//fonction principale
function chatBot(){
    let text=TEXTAREA.value
    addMessage(text)
    //je dois communiquer avec le backend
    var url_backend="http://127.0.0.1:8000/analyse"
    fetch(url_backend,
        {
            method:"POST",
            body:JSON.stringify({"texte":text}),
            headers:{  
                'Content-Type': 'application/json'
            }          
        })
    .then(reponse=>{
   
      onFinnishloadMessage()
        reponse.json()
        .then(data=>{
          let text = JSON.stringify(data.msg.content.replace(/\n/g, "<br />"), null, 2);
            console.log(data)
            addResponse(text)
        })
    })
    .catch(e=>{
      onFinnishloadMessage()
        console.warn(e)
    })


}

function onloadMessage(){
  // $('.bi-send').hide()
  SPINNER.style.display = 'block';
  BTN.disabled = true;

}

function onFinnishloadMessage(){
  BTN.disabled = false;
  SPINNER.style.display = 'none';
  // $('.bi-send').show()
  TEXTAREA.value = ''
}

function addResponse (text){
  $('.chat-container').append(
    ` <div class="message user-message">
    <div class="avatar">
      <img src="https://via.placeholder.com/40" alt="User Avatar">
    </div>
    <div class="message-text">
       ${text}
    </div>
  </div>`
  );
}
function addMessage (text){
  $('.chat-container').append(
    `  <div class="message other-message">
    <div class="message-text">
     ${text}
    </div>
    <div class="avatar">
      <img src="https://via.placeholder.com/40" alt="Other User Avatar">
    </div>
  </div>
  `
  );
}


// Fonction pour démarrer la reconnaissance vocale
async function speechToText() {
    // alert("Je suis speech to text");
    try {
      // Commencez la reconnaissance vocale
    demarrerEnregistrement();
    await  recognition.start();
    } catch (error) {
      console.error('Erreur lors du démarrage de la reconnaissance vocale :', error);
    }
  }

recognition.onresult = function(event) {

    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    // Display the interim transcript in the modal
    document.getElementById('transcriptionText').innerHTML = interimTranscript;
    
    //2ème partie récupérer le texte
    var message = event.results[0][0].transcript;
    console.log('Result received: ' + message + '.');
    console.log('Confidence: ' + event.results[0][0].confidence);

    //3ème partie remplir l'input en utilisant ce texte
    if (event.results[0][0].confidence > 0.6)
        {TEXTAREA.value=message}
  }
  recognition.onend = () => {
    arreterEnregistrement();
    console.log('La reconnaissance vocale est terminée.');
  };


  function demarrerEnregistrement() {
    $('#microphoneModal').modal('show');
    // Vous pouvez ajouter ici du code pour démarrer l'enregistrement vocal.
  }

  function arreterEnregistrement() {
    recognition.stop();
    $('#microphoneModal').modal('hide');
  }