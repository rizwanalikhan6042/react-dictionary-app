import React from "react";
import useDictionary from "../hooks/useDictionary";
import "../style/dictionary.css";

function Dictionary() {
  const {
    word, setWord, meaning = [],
    setMeaning, isLoading,
    handleSearch, definition, setResult,
    result, setDefinition, error, audio, searchHistory,darkMode,setDarkMode,toggleDarkMode,handlePlayDefinitions, setSearchHistory, playDefinitions, toggleDefinitionAudio, isPlaying,setIsPlaying
  } = useDictionary();

  return (
     
    <div className="dictionary-container">
    {/* <div>
      <button onClick={toggleDarkMode} className="toggle-btn">
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>

      <h1>Hello World</h1>
      <p>This is {darkMode ? 'Dark' : 'Light'} mode.</p>
    </div>       */}
      {/* Input field for typing the word */}

      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch(e);
        }}
      />

      {/* Search button with loading state */}
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </button>
      {error && <div className="error-message">{error}</div>}
      {audio && (
        <div style={{ marginTop: "1rem" }}>
          {/* Replace old Pronounce button with new Play Definitions button */}
          {meaning.length > 0 && (
            // <button onClick={handlePlayDefinitions}>
            //   ▶️ Play Definitions
            // </button>
            <button onClick={toggleDefinitionAudio}>
              {isPlaying ? "Stop Audio" : "Play Audio"}
            </button>

          )}

        </div>
      )}

      {/* Show definitions only if 'meaning' is a valid array and has entries */}
      {Array.isArray(meaning) && meaning.length > 0 && (
        <div className="definition-box">
          <h2>Definitions:</h2>

          {/* Loop through first 3 entries */}
          {meaning.slice(0, 3).map((entry, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              {/* Part of speech shown */}
              <h4>
                Part of Speech: <em>{entry.partOfSpeech}</em>
              </h4>

              {/* Loop through first 3 definitions for each part of speech */}
              <ul>
                {(entry.definitions || []).slice(0, 3).map((def, i) => (
                  <li key={i}>
                    {def.definition}

                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}


      {searchHistory.length > 0 && (
        <div>
          <h2>Search History:</h2>
          <ul>
            {searchHistory.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default Dictionary;
