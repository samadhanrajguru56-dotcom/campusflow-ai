import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function VoiceInputButton({ onTranscript, isAnalyzing = false }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const reco = new SpeechRecognition();
    reco.continuous = false;
    reco.interimResults = false;
    reco.lang = 'en-US';

    reco.onstart = () => {
      setIsListening(true);
    };

    reco.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && onTranscript) {
        onTranscript(transcript);
      }
      setIsListening(false);
    };

    reco.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    reco.onend = () => {
      setIsListening(false);
    };

    setRecognition(reco);
  }, [onTranscript]);

  const toggleListen = () => {
    if (!isSupported) {
      alert('Speech recognition is not natively supported in this browser. Please type your problem report directly.');
      return;
    }

    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      try {
        recognition?.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input not supported in this browser"
        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 bg-slate-800/50 border border-slate-700/50 flex items-center gap-1.5 opacity-60 cursor-not-allowed"
      >
        <MicOff className="w-3.5 h-3.5" />
        <span>Voice (Unavailable)</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleListen}
      disabled={isAnalyzing}
      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-200 border ${
        isListening
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50'
      }`}
    >
      {isListening ? (
        <>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <Volume2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Listening... (Speak problem)</span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-emerald-400" />
          <span>🎙 Voice Input</span>
        </>
      )}
    </button>
  );
}
