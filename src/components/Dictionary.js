import React from "react";
import useDictionary from "../hooks/useDictionary";

function Dictionary() {
  const {
    word, setWord, meaning = [], // ✅ default value added here
    setMeaning, isLoading,
    handleSearch, definition, setResult,
    result, setDefinition, error
  } = useDictionary();

  return (
    <div className="dictionary-container">
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
                  <li key={i}>{def.definition}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Show error if exists */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Dictionary;
