import React from "react";
import useDictionary from "../hooks/useDictionary";

function Dictionary() {
    const {
        word, setWord, meaning, setMeaning, isLoading,
        handleSearch, definition, setResult, result, setDefinition,error
    } = useDictionary();
    return (
        <div className="dictionary-container">
            <input type="text" value={word} onChange={(e) => setWord(e.target.value)}
                placeholder="Enter a word" onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch(e);
                }} />
            <button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "searching" : "search"}
            </button>
            {definition && (
                <div className="definition-box">
                    <h2>Definition:</h2>
                    <p>{definition}</p>
                </div>
            )}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    )


}

export default Dictionary;

