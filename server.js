const express = require('express');
const camelCase = require('camelcase');
const app = express();
const path = require('path');
const router = express.Router();
app.use(express.static('public/css'));

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
let komenKleurenOvereen = false;
let overeenkomstenInProcenten = 0;
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
  } else if (gebruikerOogKleuren.length <= 0) {
    //Als de oogkleuren lijst leeg is en dus een oogkleur was ingevuld die niet bestaat, verander naar "Geen Antwoord"
    nieuweOogKleurNotatie = "Geen Antwoord"
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
  komenKleurenOvereen = String(kledingKleuren).toLowerCase().indexOf(oogKleur.toLowerCase()) >= 0;
  if(komenKleurenOvereen) {
    console.log(`Oogkleur komt WEL overeen met 1 van de kledingstukken.`);
  } else {
    console.log("Oogkleur komt NIET overeen met 1 van de kledingstukken.");
  }
}


//Berekend het aantal procent van overeenkomsten met oogkleur en totaal aantal kleren
function toonKleurOvereenkomsten() {
  overeenkomstenInProcenten = (aantalOvereenkomsten / totaalAantalKleren) * 100;
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


app.get('/test', function(req, res) { 
  res.type("text/html"); 
  res.status(200); 
  res.send(dataset);
});

app.listen(3000);