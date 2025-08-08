import { useState, useEffect } from "react";

function useDictionary() {
    const [word, setWord] = useState("");
    const [meaning, setMeaning] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [audio, setAudio] = useState(null);
    const [definition, setDefinition] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // 🔹 Handle search (works for manual + voice input)
    const handleSearch = async (searchTerm) => {
        const query = String(searchTerm || word||"").trim(); // agar voice se aya toh use karega
        speechSynthesis.cancel();
        setIsPlaying(false);

        if (!query) {
            setError("Please enter a word.");
            setMeaning([]);
            setAudio(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        setMeaning([]);
        setAudio(null);

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
            const data = await response.json();

            if (!Array.isArray(data)) {
                setError(data.message || "Word not found.");
                return;
            }

            if (query && !searchHistory.includes(query)) {
                setSearchHistory(prev => [query, ...prev]);
            }

            if (data[0]?.meanings) {
                setMeaning(data[0].meanings);
            }

            let phonetics = data[0]?.phonetics || [];
            let foundAudio = phonetics.find(p => p.audio);
            setAudio(foundAudio ? foundAudio.audio : null);

        } catch (err) {
            setError("An error occurred while fetching the data.");
        } finally {
            setIsLoading(false);
        }
    };

    // Save history in localStorage
    useEffect(() => {
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }, [searchHistory]);

    // Dark mode toggle
    useEffect(() => {
        document.body.className = darkMode ? "dark" : "light";
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    // Play all definitions one by one
    const handlePlayDefinitions = () => {
        if (!meaning || meaning.length === 0) return;
        let index = 0;

        const speakNext = () => {
            if (index >= meaning.length) {
                setIsPlaying(false);
                return;
            }

            const definitions = meaning[index].definitions;
            if (!definitions || definitions.length === 0) {
                index++;
                speakNext();
                return;
            }

            const def = definitions[0].definition;
            const utterance = new SpeechSynthesisUtterance(def);
            utterance.onend = () => {
                index++;
                speakNext();
            };
            speechSynthesis.speak(utterance);
        };

        setIsPlaying(true);
        speakNext();
    };

    // Toggle definition audio
    const toggleDefinitionAudio = () => {
        if (isPlaying) {
            speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            handlePlayDefinitions();
        }
    };

    // 🎤 Voice input
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice input.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setWord(transcript);
            handleSearch(transcript); // direct search
            console.log("Voice input:", transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setError("Voice input failed. Please try again.");
        };

        recognition.start();
    };

    return {
        word, setWord,
        meaning, isLoading,
        handleSearch, error,
        audio, definition, setDefinition,
        searchHistory, setSearchHistory,
        toggleDefinitionAudio, isPlaying, setIsPlaying, handlePlayDefinitions,
        darkMode, setDarkMode, toggleDarkMode,
        startListening
    };
}

export default useDictionary;
