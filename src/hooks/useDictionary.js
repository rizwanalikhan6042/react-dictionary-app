import { useState ,useEffect} from "react";

function useDictionary() {
    const [word, setWord] = useState("");
    const [meaning, setMeaning] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [audio, setAudio] = useState(null);
    const [definition, setDefinition] = useState("");
    const [searchHistory,setSearchHistory]=useState([])

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
            if(word){
                const alreadyExists=searchHistory.includes(word);
                if(!alreadyExists){
                    setSearchHistory(function(previousHistory){
                        return[word,...previousHistory];
                    })
                }
            }
            // ✅ Set meaning
            if (data[0]?.meanings) {
                setMeaning(data[0].meanings);
            }
            console.log(data[0].meanings)
            // ✅ Your phonetics audio logic
            let phonetics = [];
            if (data.length > 0 && data[0].phonetics) {
                phonetics = data[0].phonetics;
            }
            console.log(phonetics)

            let foundAudio = null;
            for (let i = 0; i < phonetics.length; i++) {
                if (phonetics[i].audio) {
                    foundAudio = phonetics[i];
                    break;
                }
            }
            console.log(foundAudio)

            if (foundAudio !== null) {
                setAudio(foundAudio.audio);
            } else {
                setAudio(null); // No audio found
            }

        } catch (err) {
            setError("");
        } finally {
            setIsLoading(false);
        }
    };
   useEffect(()=>{
    localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
   },[searchHistory]);

    const handlePlayDefinitions = () => {

        if (!meaning || meaning.length === 0) return;
        let index = 0;
        const speakNext = () => {
            if (index >= meaning.length) return;
            const definitions = meaning[index].definitions;
            if (!definitions || definitions.length === 0) {
                index++;
                speakNext(); // skip if no definitions
                return;
            }
            const def = definitions[0].definition;
            const utterance = new SpeechSynthesisUtterance(def);
            utterance.onend = () => {
                index++;
                speakNext()
            }
            speechSynthesis.speak(utterance);
        }
        speakNext()
    }
    return {
        word,
        setWord,
        meaning,
        isLoading,
        handleSearch,
        error,
        audio, handlePlayDefinitions, definition, setDefinition
        ,searchHistory,setSearchHistory
    };
}


export default useDictionary;
