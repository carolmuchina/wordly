const searchForm = document.getElementById("searchForm");
const wordInput = document.getElementById("wordInput");
const wordDetails = document.getElementById("wordDetails");
const audioPlayer = document.getElementById("audio");
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const word = wordInput.value.trim();
    if (!word) {
        return;
    }
    const APIURL= `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(APIURL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Word not found");
        }
        return response.json();
    })
    .then(data => {
        const searchedWord = data[0].word;
        const pronunciation = data[0].phonetic;
        const audioURL = data[0].phonetics.find(item => item.audio)?.audio;
        audioPlayer.onerror = function() {
            const utterance = new SpeechSynthesisUtterance(searchedWord);
            speechSynthesis.speak(utterance);
        };
        audioPlayer.src = audioURL;
        console.log(audioURL);
        console.log(data[0]);
        const meanings = data[0].meanings;
        wordDetails.innerHTML = `
        <strong class="key">${searchedWord}</strong>
        <span class="pronunciation">${pronunciation}</span>`;
        meanings.forEach((meaning) => {
             const synonyms = meaning.synonyms;
            if (synonyms.length === 0) {
                const noSynonyms = document.createElement("p");
                    noSynonyms.textContent = "No synonyms available.";
                    wordDetails.appendChild(noSynonyms);
            } else {
                const synonymsPara = document.createElement("p");
                synonymsPara.textContent = "Synonyms: " + synonyms.join(", ");
                wordDetails.appendChild(synonymsPara);
            }
            console.log(synonyms);
            const definitions = meaning.definitions;
            definitions.forEach((item) => {
                const definitionsPara = document.createElement("p");
                definitionsPara.textContent = item.definition;
                wordDetails.appendChild(definitionsPara);
            });
});
})
.catch(error => {
    wordDetails.textContent = error.message;
});
});

