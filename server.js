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
let newList = [];
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
let alleOogKleuren = [];//!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let veld;

// Veranderd de waarde van het gegeven antwoord op een vraag
function changeKey(index, newValue) {
  new_key[Object.keys(new_key)[index]] = newValue;
  Object.defineProperty(dataset[i], new_key, {});
}

//Vervangt lege velden met "Geen antwoord"
function vervangLegeVelden() {
  aantalVelden = Object.keys(old_key).length;

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








//Als oogKleur het woord "donker" of "licht" bevat, haal het weg
function verwijderDonkerLicht() {
  if(oogKleur.indexOf('donker') >= 0 || oogKleur.indexOf('licht') >= 0) {
    if(oogKleur.indexOf('donker') >= 0) { 
      newList = oogKleur.split("donker");
    } else if(oogKleur.indexOf('licht') >= 0) { 
      newList = oogKleur.split("licht");
    }
    oogKleur = newList[1];
    changeKey(1, oogKleur);
  }
}

//Noteerd oogkleur op dezelfde manier als er 2 kleuren zijn, bijv "Blauw - Groen" inplaats van "groen blauw"
function noteerOogKleurOpDezelfdeManier() {
  //Loop langs alle mogelijke oogkleuren 
  mogelijkeOogKleuren.forEach(mogelijkeOogKleur => {
    //Als de gegeven oogkleur een bestaande oogkleur is voeg toe aan array
    if(oogKleur.indexOf(mogelijkeOogKleur) >= 0) { 
      gebruikerOogKleuren.push(mogelijkeOogKleur);
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
    oogKleur = String(old_key[Object.keys(old_key)[1]]).toLowerCase();
    verwijderDonkerLicht();
    //Veranderd de eerste letter van de oogKleur naar een hoofdletter
    changeKey(1, camelCase(oogKleur, {pascalCase: true}));
    noteerOogKleurOpDezelfdeManier();
}







//Sorteert een array op alfabetische volgorde
function sortList(arr) {
  //Checked of het gegeven antwoord komma's bevat en dus een array is
  if(arr.indexOf(',') >= -1) {
    //Split antwoorden op komma
    newList = arr.split(", ");
    //Zorgt ervoor dat elk woord begint met een hoofdletter
    newList = newList.map(item => camelCase(item, {pascalCase: true}));

    //Sorteert op alfabetische volgorde
    newList.sort();

    return newList;
  }
}

function wijzigKledingKleuren() {
  kledingKleuren = String(old_key[Object.keys(old_key)[8]]).toLowerCase();
  kledingKleuren = sortList(kledingKleuren);
  changeKey(8, String(kledingKleuren));
}

function telAantalKledingStukken() {
  totaalAantalKleren += newList.length;
  
}












//Kijkt of de oogKleur en kleuren van kleding hetzelfde zijn
function vergelijkKleuren() {
  //Kijkt naar het aantal overeenkomsten
  kledingKleuren.forEach(kledingKleur => {
    if(oogKleur.toLowerCase() == kledingKleur.toLowerCase()) {
      aantalOvereenkomsten++;
    }
  });

  komenKleurenOvereen = String(kledingKleuren).toLowerCase().indexOf(oogKleur.toLowerCase()) >= 0;
  if(komenKleurenOvereen) {
    console.log(`Oogkleur komt WEL overeen met 1 van de kledingstukken.`);
  } else {
    console.log("Oogkleur komt NIET overeen met 1 van de kledingstukken.");
  }
}


//Berekend het aantal procent van overeenkomsten met oogkleur en totaal aantal kleren
function toonOvereenkomsten() {
  overeenkomstenInProcenten = (aantalOvereenkomsten / totaalAantalKleren) * 100;
  console.log(`${aantalOvereenkomsten}/${totaalAantalKleren} (${overeenkomstenInProcenten.toFixed(2)}%) van alle kleren hebben zelfde kleur als de oogkleur(en) van de gebruikers.`);  
}






app.get('/', function (req, res) {
  aantalGebruikers = 1;
  
  for(i = 0; i < dataset.length; i++) {

    console.log(`\n--- Gebruiker ${aantalGebruikers} ---------------------------------------------------------`);
    old_key = dataset[i];
    new_key = old_key;

    wijzigOogkleur();
    wijzigKledingKleuren();
    vergelijkKleuren();
    vervangLegeVelden();
    vervangRareChars();
    telAantalKledingStukken();

    console.log(`Wat is je oogkleur? : ${dataset[i]["Wat is je oogkleur?"]}`);
    console.log(`Welke kleur kledingstukken heb je aan vandaag? : ${dataset[i][ "Welke kleur kledingstukken heb je aan vandaag? (Meerdere antwoorden mogelijk natuurlijk...)"]}`);
  
    aantalGebruikers++;
  }

 

  toonOvereenkomsten();

  //__dirname zorgt ervoor dat het automatisch naar mijn project folder ga
  res.sendFile(path.join(__dirname+'/index.html'), {});
})
 
app.listen(3000);