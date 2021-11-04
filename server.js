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
let aantalGebruikers = 0;
let oogKleur;
let kledingKleuren = [];
let sortedList = [];
let aantalOvereenkomsten = 0;
let totaalAantalKleren = 0;
let mogelijkeOogKleuren = ["blauw", "bruin", "grijs", "groen"];
let aantalBlauweOgen = 0;
let aantalBruineOgen = 0;
let aantalGrijzeOgen = 0;
let aantalGroeneOgen = 0;
let gebruikerOogKleuren = [];
let veld;

// Veranderd de waarde van het gegeven antwoord op een vraag
function changeKey(index, newValue) {
  new_key[Object.keys(new_key)[index]] = newValue;
  Object.defineProperty(dataset[i], new_key, {});
}

//Vervangt lege velden met "Geen antwoord"
function vervangLegeVelden() {
  for(j = 0; j < Object.keys(old_key).length; j++) {
    veld = old_key[Object.keys(old_key)[j]];
    if(veld == null || veld == "") {
      changeKey(j, "Geen antwoord");
    }
  }
}

let filterChars = /[@#$%^&*()_+\=\[\]{};':"\\|<>]+/;
//Vervangt deze characters met ""
function vervangRareChars() {
  for(j = 0; j < Object.keys(old_key).length; j++) {
    veld = old_key[Object.keys(old_key)[j]];

    if(filterChars.test(veld)) {
      veld = veld.replace(filterChars, '');
      changeKey(j, veld);
     }
  }
}
//Bron https://thispointer.com/javascript-check-if-string-contains-special-characters/


let woordenLijst = ["donker", "licht"]
//Checked of de gegeven value een woord bevat uit de woordenLijst en verwijderd deze
function verwijderWoorden(string) {
  woordenLijst.forEach(woord => {
    if(string.includes(woord)) {
      sortedList = string.split(woord);
      oogKleur = sortedList[1];
      changeKey(1, oogKleur);
    }
  });
}

function toonAantalOgenPerKleur() {
  console.log(`Aantal blauwe ogen: ${aantalBlauweOgen}\nAantal bruine ogen: ${aantalBruineOgen}\nAantal grijze ogen: ${aantalGrijzeOgen}\nAantal groene ogen: ${aantalGroeneOgen}\n`)
}


//Verhoogt het aantal ogen per kleur
function verhoogOogKleurAantal(kleur) {
  if(kleur == mogelijkeOogKleuren[0]) {
    aantalBlauweOgen++;
  } else if(kleur == mogelijkeOogKleuren[1]) {
    aantalBruineOgen++;
  } else if(kleur == mogelijkeOogKleuren[2]) {
    aantalGrijzeOgen++;
  } else if(kleur == mogelijkeOogKleuren[3]) {
    aantalGroeneOgen++;
  }
}

//Noteerd oogkleur op dezelfde manier als er 2 kleuren zijn, bijv "Blauw - Groen" inplaats van "groen blauw"
function noteerOogKleurOpDezelfdeManier() {
  //Loop langs alle mogelijke oogkleuren 
  mogelijkeOogKleuren.forEach(mogelijkeOogKleur => {
    //Als de gegeven oogkleur een bestaande oogkleur is voeg toe aan array
    if(oogKleur.indexOf(mogelijkeOogKleur) >= 0) { 
      gebruikerOogKleuren.push(mogelijkeOogKleur);
      verhoogOogKleurAantal(mogelijkeOogKleur);
    }
  });

  //Als er meerdere oogkleuren zijn, zet er een streepje tussen
  if(gebruikerOogKleuren.length > 1) {
    nieuweOogKleurNotatie = camelCase(gebruikerOogKleuren[0], {pascalCase: true}) + " - " 
        + camelCase(gebruikerOogKleuren[1], {pascalCase: true});

    oogKleur = nieuweOogKleurNotatie;
    changeKey(1, oogKleur);
  }

  gebruikerOogKleuren.length = 0;
}

function wijzigOogkleur() {
  //Als het aantalGebruikers lager is dan de lengte van de dataset, ga verder
  if(aantalGebruikers < dataset.length) { 
    oogKleur = String(old_key[Object.keys(old_key)[1]]).toLowerCase();
    verwijderWoorden(oogKleur);
    //Veranderd de eerste letter van de oogKleur naar een hoofdletter
    changeKey(1, camelCase(oogKleur, {pascalCase: true}));
    noteerOogKleurOpDezelfdeManier();
    aantalGebruikers++;
  }
}







//Sorteert een array op alfabetische volgorde
function sortList(string) {
  //Checked of het gegeven antwoord komma's bevat en dus een array is
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


function wijzigKledingKleuren() {
  //Als het aantalGebruikers lager is dan de lengte van de dataset, ga verder
  if(aantalGebruikers < dataset.length) {
    kledingKleuren = String(old_key[Object.keys(old_key)[8]]).toLowerCase();
    kledingKleuren = sortList(kledingKleuren);

    //Telt het aantal kleren van de huidige gebruiker op bij het totaal aantal kleren
    totaalAantalKleren += kledingKleuren.length;

    changeKey(8, String(kledingKleuren));
  }
}



//Telt het aantal kleuren overeenkomsten
function telAantalKleurOvereenkomsten() { 
  kledingKleuren.forEach(kledingKleur => {
    if(oogKleur.toLowerCase() == kledingKleur.toLowerCase()) {
      aantalOvereenkomsten++;
    }
  });
}

//Kijkt of de oogKleur en kleuren van kleding hetzelfde zijn
function vergelijkKleuren() {
  let komenKleurenOvereen = false;
  komenKleurenOvereen = String(kledingKleuren).toLowerCase().indexOf(oogKleur.toLowerCase()) >= 0;
  if(komenKleurenOvereen) {
    console.log(`Oogkleur komt WEL overeen met 1 van de kledingstukken.`);
  } else {
    console.log("Oogkleur komt NIET overeen met 1 van de kledingstukken.");
  }
}


//Berekend het aantal procent van overeenkomsten met oogkleur en totaal aantal kleren
function toonKleurOvereenkomsten() {
  let overeenkomstenInProcenten = (aantalOvereenkomsten / totaalAantalKleren) * 100;
  console.log(`${aantalOvereenkomsten}/${totaalAantalKleren} (${overeenkomstenInProcenten.toFixed(2)}%) van alle kleren hebben zelfde kleur als de oogkleur(en) van de gebruikers.`);  
}



app.get('/', function (req, res) {

  for(i = 0; i < dataset.length; i++) {

    console.log(`\n--- Gebruiker ${i+1} ---------------------------------------------------------`);
    old_key = dataset[i];
    new_key = old_key;

    wijzigOogkleur();
    wijzigKledingKleuren();
    telAantalKleurOvereenkomsten();
    vergelijkKleuren();
    vervangLegeVelden();
    vervangRareChars();

    console.log(`Wat is je oogkleur? : ${dataset[i]["Wat is je oogkleur?"]}`);
    console.log(`Welke kleur kledingstukken heb je aan vandaag? : ${dataset[i][ "Welke kleur kledingstukken heb je aan vandaag? (Meerdere antwoorden mogelijk natuurlijk...)"]}`);
  }

  console.log(`\n--- Totaal ---------------------------------------------------------`);
  toonAantalOgenPerKleur();
  toonKleurOvereenkomsten();

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

}

getLastFMData()
