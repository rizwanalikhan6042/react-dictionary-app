import { useState } from "react";

function useDictionary() {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audio, setAudio] = useState(null);

  const handleSearch = async () => {
    // ⚠️ Check for empty word
    if (!word.trim()) {
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
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();

      // ❌ If response is not an array, it's an error
      if (!Array.isArray(data)) {
        setError(data.message || "Word not found.");
        return;
      }

      // ✅ Set meaning
      if (data[0]?.meanings) {
        setMeaning(data[0].meanings);
      }

      // ✅ Your phonetics audio logic
      let phonetics = [];
      if (data.length > 0 && data[0].phonetics) {
        phonetics = data[0].phonetics;
      }

      let foundAudio = null;
      for (let i = 0; i < phonetics.length; i++) {
        if (phonetics[i].audio) {
          foundAudio = phonetics[i];
          break;
        }
      }

      if (foundAudio !== null) {
        setAudio(foundAudio.audio);
      } else {
        setAudio(null); // No audio found
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    word,
    setWord,
    meaning,
    isLoading,
    handleSearch,
    error,
    audio,
  };
}

export default useDictionary;
