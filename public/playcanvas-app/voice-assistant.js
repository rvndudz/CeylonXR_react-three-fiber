(function () {
  // Create voice assistant UI
  function createVoiceAssistantUI() {
    // Add CSS styles
    const style = document.createElement("style");
    style.textContent = `
      .voice-assistant-button {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: rgba(59, 130, 246, 0.9);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
      }
      
      .voice-assistant-button:hover {
        transform: scale(1.1);
      }
      
      .voice-assistant-button.listening {
        background-color: rgba(239, 68, 68, 0.9);
        animation: pulse 1.5s infinite;
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
        }
        70% {
          transform: scale(1.05);
          box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
        }
      }
      
      .voice-feedback {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 300px;
        background-color: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 9999;
        display: none;
        max-height: 300px;
        overflow-y: auto;
      }
    `;
    document.head.appendChild(style);

    // Create button element
    const button = document.createElement("button");
    button.className = "voice-assistant-button";
    button.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>`;

    // Create feedback container
    const feedback = document.createElement("div");
    feedback.className = "voice-feedback";

    document.body.appendChild(button);
    document.body.appendChild(feedback);

    return { button, feedback };
  }

  // Initialize voice assistant functionality
  function initVoiceAssistant() {
    let recognition = null;
    let isListening = false;
    let isResponsePlaying = false;
    let transcript = "";

    const { button, feedback } = createVoiceAssistantUI();

    // Initialize speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        feedback.style.display = "block";
        feedback.innerHTML = `<strong>You said:</strong><br>${transcript}`;
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };
    } else {
      button.style.backgroundColor = "rgba(156, 163, 175, 0.7)";
      button.disabled = true;
      feedback.style.display = "block";
      feedback.innerHTML =
        "<strong>Error:</strong> Speech recognition is not supported in this browser.";
      return;
    }

    // Toggle listening state
    function toggleListening() {
      if (isResponsePlaying) return;

      if (isListening) {
        // Stop listening
        isListening = false;
        button.classList.remove("listening");
        button.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>`;
        recognition.stop();

        if (transcript) {
          sendToAPI(transcript);
        }
      } else {
        // Start listening
        isListening = true;
        button.classList.add("listening");
        button.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .87-.13 1.71-.37 2.5"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>`;
        transcript = "";
        recognition.start();
      }
    }

    // Send question to API
    async function sendToAPI(text) {
      try {
        isResponsePlaying = true;
        feedback.innerHTML = `<strong>You said:</strong><br>${text}<br><br><strong>Processing...</strong>`;

        const response = await fetch(
          "http://localhost:5103/api/AssistantApi/question",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: text }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();
        feedback.innerHTML = `<strong>You said:</strong><br>${text}<br><br><strong>Assistant:</strong><br>${data}`;
        speakResponse(data);
      } catch (error) {
        console.error("Error sending question to API:", error);
        feedback.innerHTML = `<strong>Error:</strong><br>Failed to get a response. Please try again.`;
        isResponsePlaying = false;
      }
    }

    // Speak response with text-to-speech
    function speakResponse(text) {
      const speech = new SpeechSynthesisUtterance(text);

      feedback.innerHTML += "<br><br><em>Assistant is speaking...</em>";

      speech.onend = () => {
        isResponsePlaying = false;
        feedback.innerHTML = feedback.innerHTML.replace(
          "<br><br><em>Assistant is speaking...</em>",
          ""
        );
      };

      window.speechSynthesis.speak(speech);
    }

    // Add click event to button
    button.addEventListener("click", toggleListening);
  }

  // Initialize when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVoiceAssistant);
  } else {
    initVoiceAssistant();
  }
})();
