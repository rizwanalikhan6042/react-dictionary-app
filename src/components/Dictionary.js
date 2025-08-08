import React from "react";
import useDictionary from "../hooks/useDictionary";
import "../style/dictionary.css";

function Dictionary() {
  const {
    word, setWord, meaning = [],
    setMeaning, isLoading,
    handleSearch, definition, setResult,
    result, setDefinition, error, audio, searchHistory, darkMode, setDarkMode, toggleDarkMode, handlePlayDefinitions, setSearchHistory, playDefinitions, toggleDefinitionAudio, isPlaying, setIsPlaying, startListening
  } = useDictionary();

  return (
    <>
      {/* 🔲 Dark Mode Toggle Button */}
      <div>
        <button onClick={toggleDarkMode} className="toggle-btn" style={{ marginBottom: '1rem' }}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Main Dictionary Container */}
      <div className="dictionary-container">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(word);
          }}
        />
        
          <button className="btn" onClick={() => handleSearch(word)} disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>
          <div className="btn-row">
          <button className="btn mic speak-btn" onClick={startListening}> Speak</button>
        
        {error && <div className="error-message">{error}</div>}

        {audio && (
          <div style={{ marginTop: "1rem" }}>
            {meaning.length > 0 && (
              <button className="btn-audio" onClick={toggleDefinitionAudio}>
                {isPlaying ? "Stop Audio" : "Play Audio"}
              </button>
            )}
          </div>
        )}
       </div>
        {Array.isArray(meaning) && meaning.length > 0 && (
          <div className="definition-box">
            <h2>Definitions:</h2>
            {meaning.slice(0, 3).map((entry, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <h4>
                  Part of Speech: <em>{entry.partOfSpeech}</em>
                </h4>
                <ul>
                  {(entry.definitions || []).slice(0, 3).map((def, i) => (
                    <li key={i}>{def.definition}</li>
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
    </>
  );

}

export default Dictionary;
