import { useState } from "react";


function useDictionary() {
    const [word, setWord] = useState("");
    const [meaning, setMeaning] = useState([]);
    const [definition, setDefinition] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState("");


    const handleSearch = (e) => {
        e.preventDefault();
        fetchMeaning();
    };

    const fetchMeaning = async () => {
        if (!word.trim()) {
            return;        // Skip if input is empty
        }
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            const data = await res.json();
            const allMeanings = data[0]?.meanings || [];
            setMeaning(allMeanings);  // now it's an array
            setResult(data);
            setIsLoading(false)
            console.log("API data :", data);
        }
        catch (error) {
            setError("Word not found or failed to fetch.");
            setMeaning([]);            // ✅ clear old meanings
            setDefinition("");         // ✅ clear old definition
            setResult(null);

        }
        finally {
            setIsLoading(false);
        }

    }
    return {
       word,
    setWord,
    meaning,          
    setMeaning,       
    definition,
    setDefinition,    
    isLoading,
    handleSearch,
    error,
    result,           
    setResult      
    };

}

export default useDictionary