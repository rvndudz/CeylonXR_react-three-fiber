import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isResponsePlaying, setIsResponsePlaying] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        setTranscript(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Update recognition when isListening changes
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.start();
    } else if (transcript) {
      sendToAPI(transcript);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  // Toggle microphone on/off
  const toggleListening = () => {
    if (isResponsePlaying || !recognitionRef.current) return; // Prevent toggling while response is playing

    if (isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      setTranscript("");
    }
  };

  // Send captured text to API using fetch
  const sendToAPI = async (text) => {
    try {
      setIsResponsePlaying(true);
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
      setResponse(data);
      speakResponse(data);
    } catch (error) {
      console.error("Error sending question to API:", error);
      setIsResponsePlaying(false);
    }
  };

  // Speak the API response
  const speakResponse = (text) => {
    const speech = new SpeechSynthesisUtterance(text);

    speech.onend = () => {
      setIsResponsePlaying(false);
    };

    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="absolute right-4 top-4 z-20">
      <button
        onClick={toggleListening}
        disabled={isResponsePlaying}
        className={`flex items-center justify-center size-12 rounded-full ${
          isListening ? "bg-red-500" : "bg-blue-500"
        } ${
          isResponsePlaying ? "opacity-50" : "opacity-90 hover:opacity-100"
        } transition-all duration-200 shadow-md`}
      >
        {isListening ? (
          <FaMicrophoneSlash className="text-white text-xl" />
        ) : (
          <FaMicrophone className="text-white text-xl" />
        )}
      </button>

      {/* Feedback display */}
      {(transcript || response || isResponsePlaying) && (
        <div className="absolute right-0 top-16 w-64 bg-black/75 text-white p-3 rounded-md text-sm">
          {transcript && (
            <div className="mb-2">
              <p className="font-bold text-xs">You said:</p>
              <p>{transcript}</p>
            </div>
          )}
          {response && (
            <div>
              <p className="font-bold text-xs">Assistant:</p>
              <p>{response}</p>
            </div>
          )}
          {isResponsePlaying && (
            <div className="text-center mt-2 text-xs italic">
              <p>Assistant is speaking...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
