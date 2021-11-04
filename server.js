const express = require('express');
const camelCase = require('camelcase');
const app = express();
const path = require('path');
const router = express.Router();
app.use(express.static('public/css'));
const dotenv = require('dotenv').config()

const fs = require('fs');
const jsonString = fs.readFileSync('./tech-track-dataset.json');
const dataset = JSON.parse(jsonString);
//Bron https://medium.com/@osiolabs/read-write-json-files-with-node-js-92d03cc82824

// Variabellen
let old_key;
let new_key;
let amountOfUsers = 0;
let eyeColor;
let clothesColor = [];
let sortedList = [];
let amountOfMatches = 0;
let totalAmountOfClothes = 0;
let possibleEyeColors = ["blauw", "bruin", "grijs", "groen"];
let amountOfBlueEyes = 0;
let amountOfBrownEyes = 0;
let amountOfGreyEyes = 0;
let amountOfGreenEyes = 0;
let userEyeColors = [];
let field;

// Veranderd de waarde van het gegeven antwoord op een vraag
function changeKey(index, newValue) {
  new_key[Object.keys(new_key)[index]] = newValue;
  Object.defineProperty(dataset[i], new_key, {});
}

//Vervangt lege velden met "Geen antwoord"
function replaceEmptyFields () {
  for(j = 0; j < Object.keys(old_key).length; j++) {
    field = old_key[Object.keys(old_key)[j]];
    if(field == null || field == "") {
      changeKey(j, "Geen antwoord");
    }
  }
}

let filterChars = /[@#$%^&*()_+\=\[\]{};':"\\|<>]+/;
//Vervangt bovenstaande karakters met ""
function replaceSpecialCharacters() {
  for(j = 0; j < Object.keys(old_key).length; j++) {
    field = old_key[Object.keys(old_key)[j]];

    if(filterChars.test(field)) {
      field = field.replace(filterChars, '');
      changeKey(j, field);
     }
  }
}
//Bron https://thispointer.com/javascript-check-if-string-contains-special-characters/

let filterList = ["donker", "licht"]
//Kijkt of de gegeven waarde een woord bevat uit filterList en verwijderd deze
function filterOutWords(string) {
  filterList.forEach(word => {
    if(string.includes(word)) {
      sortedList = string.split(word);
      eyeColor = sortedList[1];
      changeKey(1, eyeColor);
    }
  });
}

//Verhoogt het aantal ogen per kleur
function increaseAmountOfEyesColor(color) {
  if(color == possibleEyeColors[0]) {
    amountOfBlueEyes++;
  } else if(color == possibleEyeColors[1]) {
    amountOfBrownEyes++;
  } else if(color == possibleEyeColors[2]) {
    amountOfGreyEyes++;
  } else if(color == possibleEyeColors[3]) {
    amountOfGreenEyes++;
  }
}

//Toont het aantal ogen per kleur
function showAmountOfEyesPerColor() {
  console.log(`Aantal blauwe ogen: ${amountOfBlueEyes}\nAantal bruine ogen: ${amountOfBrownEyes}\nAantal grijze ogen: ${amountOfGreyEyes}\nAantal groene ogen: ${amountOfGreenEyes}\n`)
}


//Noteert oogkleur op dezelfde manier als er 2 kleuren zijn, bijv. "Blauw - Groen" in plaats van "groen blauw"
function writeEyeColorTheSameWay () {
  //Loop langs alle mogelijke oogkleuren 
  possibleEyeColors.forEach(possibleEyeColor => {
    //Als de gegeven oogkleur een bestaande oogkleur is, voeg toe aan array
    if(eyeColor.indexOf(possibleEyeColor) >= 0) { 
      userEyeColors.push(possibleEyeColor);
      increaseAmountOfEyesColor(possibleEyeColor);
    }
  });

  //Als er meerdere oogkleuren zijn, zet er een streepje tussen
  if(userEyeColors.length > 1) {
    newEyeColorNotation = camelCase(userEyeColors[0], {pascalCase: true}) + " - " 
        + camelCase(userEyeColors[1], {pascalCase: true});

    eyeColor = newEyeColorNotation;
    changeKey(1, eyeColor);
  }

  userEyeColors.length = 0;
}

//Wijzigt de oogkleur
function editEyeColor() {
  //Als het amountOfUsers lager is dan de lengte van de dataset, ga verder
  if(amountOfUsers < dataset.length) { 
    eyeColor = String(old_key[Object.keys(old_key)[1]]).toLowerCase();
    filterOutWords(eyeColor);
    //Veranderd de eerste letter van eyeColor naar een hoofdletter
    changeKey(1, camelCase(eyeColor, {pascalCase: true}));
    writeEyeColorTheSameWay ();
    amountOfUsers++;
  }
}

//Sorteert een string op alfabetische volgorde en zet het om naar een array
function sortList(string) {
  //Kijkt of het gegeven antwoord komma's bevat en dus een array is
  if(string.indexOf(',') >= -1) {
    //Split antwoorden op komma
    sortedList = string.split(", ");
    //Zorgt ervoor dat elk woord begint met een hoofdletter
    sortedList = sortedList.map(item => camelCase(item, {pascalCase: true}));
    //Sorteert op alfabetische volgorde
    sortedList.sort();

    return sortedList;
  }
}

//Wijzigt kleding kleuren
function editClothesColors() {
  //Als amountOfUsers lager is dan de lengte van de dataset, ga verder
  if(amountOfUsers < dataset.length) {
    clothesColor = String(old_key[Object.keys(old_key)[8]]).toLowerCase();
    clothesColor = sortList(clothesColor);
    //Telt het aantal kleren van de huidige gebruiker op bij het totaal aantal kleren
    totalAmountOfClothes += clothesColor.length;

    changeKey(8, String(clothesColor));
  }
}

//Telt het aantal kleuren overeenkomsten
function countAmountOfColorMatches() { 
  clothesColor.forEach(clothesColor => {
    if(eyeColor.toLowerCase() == clothesColor.toLowerCase()) {
      amountOfMatches++;
    }
  });
}

//Kijkt of oogkleur en kleuren van kleding hetzelfde zijn
function compareColors() {
  let doColorsMatch = false;
  doColorsMatch = String(clothesColor).toLowerCase().indexOf(eyeColor.toLowerCase()) >= 0;
  if(doColorsMatch) {
    messageWord = "WEL"
  } else {
    messageWord = "NIET"
  }
  console.log(`Oogkleur komt ${messageWord} overeen met 1 van de kledingstukken.`);
}


//Berekend het aantal overeenkomsten met oogkleur en totaal aantal kleren (+in procenten) 
function showColorMatches() {
  let overeenkomstenInProcenten = (amountOfMatches / totalAmountOfClothes) * 100;
  console.log(`${amountOfMatches}/${totalAmountOfClothes} (${overeenkomstenInProcenten.toFixed(2)}%) van alle kleren hebben zelfde kleur als de oogkleur(en) van de gebruikers.`);  
}



app.get('/', function (req, res) {

  for(i = 0; i < dataset.length; i++) {

    console.log(`\n--- Gebruiker ${i+1} ---------------------------------------------------------`);
    old_key = dataset[i];
    new_key = old_key;

    editEyeColor();
    editClothesColors();
    countAmountOfColorMatches();
    compareColors();
    replaceEmptyFields ();
    replaceSpecialCharacters();

    console.log(`Wat is je oogkleur? : ${dataset[i]["Wat is je oogkleur?"]}`);
    console.log(`Welke kleur kledingstukken heb je aan vandaag? : ${dataset[i][ "Welke kleur kledingstukken heb je aan vandaag? (Meerdere antwoorden mogelijk natuurlijk...)"]}`);
  }

  console.log(`\n--- Totaal ---------------------------------------------------------`);
  showAmountOfEyesPerColor();
  showColorMatches();

  //getLastFMData();

  //__dirname zorgt ervoor dat het automatisch naar mijn project folder ga
  res.sendFile(path.join(__dirname+'/index.html'), dataset);
})

app.listen(3000);




//LASTFM API
const API = require('last.fm.api'),
api = new API({ 
  apiKey: process.env.KEY,
  apiSecret: process.env.SECRET 
});

//LASTFM variabelen
let user = {};
let topUserTracks = [];
let topTrackFromGenre = [];
let userName, genre, period, limit;

//Corrigeert de notatie van de artiest(en) en het liedje
function correctSongNotation(arr) {
  let wordsToBeRemoved = ["with", "ft", "feat", "Feat"];
  let songNameList, extractedSongName, extractedArtistName;
  //Als de song titel een artiest bevat verplaats dit naar de artiest naam en haal "with"/"feat."/etc. weg
  arr.forEach(item => {
    wordsToBeRemoved.forEach(wordToBeRemoved => {
      if (item.songName.includes(wordToBeRemoved)) {
        songNameList = item.songName.split(`${wordToBeRemoved}`)
        //Verwijder haakjes van het liedje
        extractedSongName = songNameList[0].replace("(", "");

        //Check als het laatste character een spatie is en verwijder dit
        if(extractedSongName.substring(extractedSongName.length-1) == " ")
        {
          extractedSongName = extractedSongName.substring(0, extractedSongName.length-1);
        }

        //Verwijder haakjes, spaties en punten van de artiesten naam
        extractedArtistName = songNameList[1].replace(")", "").replace(" ", "").replace(".", "");

        item.songName = extractedSongName;
        item.artistName = `${item.artistName}, ${extractedArtistName}`;
      }
    });
  });
}

//Haalt algemene gebruikers info op
function getUserInfo() {
  api.user.getInfo({
    user: userName
  }).then(tags => { 
    user = {
      userName: tags.user.name,
      country: tags.user.country,
      playCount: tags.user.playcount
    };
    console.log(`\n--- ${userName} info ---------------------------------------------------------`);
    console.log(user);
  }).catch(err => { 
    console.error(err); 
  });
}

//Haalt de meest beluisterde artiesten op van de gegeven gebruiker
function getUserTopArtists() {
  let topUserArtists = [];
  api.user.getTopArtists({
    user: userName,
    period: period,
    limit: limit
  }).then(tags => {
    tags.topartists.artist.forEach(artist => {
      topUserArtists.push({
        artistName: artist.name,
        playCount: artist.playcount,
      })
    });
    console.log(`\n--- Top Artists from ${userName} in the last 12 months ---------------------------------------------------------`);
    console.log(topUserArtists);
    
    compareLists(topUserArtists)
  }).catch(err => { 
    console.error(err); 
  });
}

//Haalt de meest beluisterde artiesten op van het gegeven genre
function getTopArtistsFromGenre() {
  let topArtistsFromGenre = [];
  api.tag.getTopArtists({
    tag: genre,
    limit: limit
  }).then(tags => {
    tags.topartists.artist.forEach(artist => {
      topArtistsFromGenre.push({
        artistName: artist.name,
      })
    });
    console.log(`\n--- Top Artists from ${genre} in the last 12 months ---------------------------------------------------------`);
    console.log(topArtistsFromGenre);

    compareLists(topArtistsFromGenre)
  })
}




//Haalt de meest beluisterde liedjes op van de gegeven gebruiker
function getUserTopTracks() {
 api.user.getTopTracks({
    user: userName,
    period: period,
    limit: limit
  }).then(tags => {
    tags.toptracks.track.forEach(track => {
      topUserTracks.push({
        artistName: track.artist.name,
        songName: track.name,
        playCount: track.playcount
      })
    });

    correctSongNotation(topUserTracks);
    console.log(`\n--- Top Tracks from ${userName} in the last 12 months ---------------------------------------------------------`);
    console.log(topUserTracks);
  }).catch(err => { 
    console.error(err);
  });
}

//Haalt de meest beluisterde liedjes op van het gegeven genre
function getTopTracksFromGenre() {
  api.tag.getTopTracks({
    tag: genre,
    limit: limit
  }).then(tags => {
    tags.tracks.track.forEach(track => {
      topTrackFromGenre.push({
        artistName: track.artist.name,
        songName: track.name
      })
    });

    correctSongNotation(topTrackFromGenre);
    console.log(`\n--- Top Track from ${genre} in the last 12 months ---------------------------------------------------------`);
    console.log(topTrackFromGenre);
  })
}





let listsToBeCompared = []; 
//Vergelijkt 2 lijsten
function compareLists(arrOfLists) {

  //Voegt een lijst toe om die later te vergelijken met een andere lijst
  listsToBeCompared.push(arrOfLists)

  //Als er 2 lijsten zijn om te vergelijken...
  if(listsToBeCompared.length == 2) {

    let list1 = listsToBeCompared[0];
    let list2 = listsToBeCompared[1];
    let sameArtists = [];
    let sameSongs = [];
    
    list1.forEach(item1 => {
      list2.forEach(item2 => {
        //Als item1 en item2 een liedje is...
        if ('songName' in item1 && 'songName' in item2 ) {
           //Als beide nummers dezelfde naam hebben, voeg toe aan sameSongs
          if(item1.songName == item2.songName) {
            sameSongs.push(item1.songName)
          }
        } else {
          //Als beide artiesten dezelfde naam hebben, voeg toe aan sameSongs
          if(item1.artistName == item2.artistName) {
            sameArtists.push(item1.artistName)
          }
        }
      });
    });

    //Leegt listsToBeCompared, zodat die bij de volgende vergelijking gebruikt kan worden
    listsToBeCompared.length = 0;

    console.log(`\n--- Artiesten die zowel in jouw top ${limit} staat, als in de ${genre} top ${limit} ---------------------------------------------------------`);
    if(sameArtists.length > 0) {
      console.log(sameArtists);
    } else {
      console.log("Geen overeenkomsten gevonden.");
    }

    console.log(`\n--- Nummers die zowel in jouw top ${limit} staat, als in de ${genre} top ${limit} ---------------------------------------------------------`);
    if(sameSongs.length > 0) {
      console.log(sameSongs);
    } else {
      console.log("Geen overeenkomsten gevonden.");
    }
  }
}


//Haalt LastFM data op
function getLastFMData() {

  let periods = ["overall", "7day", "1month", "3month", "6month", "12month"]

  userName = "ChaibaFM";
  genre = "K-Pop";
  period = periods[5];
  limit = 5;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      //Als username en genre ingevuld zijn, limit hoger is dan 0 en period in periods staat, ga verder
      if(userName != "" && limit > 0 && genre != "" && periods.includes(period)) {
        resolve("Succes")
      } else {
        reject("[!] userName, genre, period of limit is verkeerd of niet ingevuld.")
      }
    }, 300);
  });
  

  promise
    .then((message) => { getUserInfo(), console.log(message) })
    .then((message) => { getUserTopArtists(), console.log(message) })
    .then((message) => { getTopArtistsFromGenre(), console.log(message) })
    .then((message) => { getUserTopTracks(), console.log(message) })
    .then((message) => { getTopTracksFromGenre(), console.log(message) })
    .catch((message) => {
      console.log("Error: " + message);
    })
  //Bron https://www.youtube.com/watch?v=DHvZLI7Db8E
}

getLastFMData()