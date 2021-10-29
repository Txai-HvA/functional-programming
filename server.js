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
let aantalGebruikers;
let oogKleur;
let kledingKleuren;
let newList = [];
let aantalOvereenkomsten = 0;
let totaalAantalKleren = 0;
let komenKleurenOvereen = false;
let overeenkomstenInProcenten = 0;
let mogelijkeOogKleuren = ["blauw", "bruin", "grijs", "groen"];
let tempOogkleuren = [];
let nieuweOogKleurNotatie;
let veld;

// Veranderd de waarde van het gegeven antwoord op een vraag
function changeKey(index, newValue) {
  new_key[Object.keys(new_key)[index]] = newValue;
  Object.defineProperty(dataset[i], new_key, {});
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
function noteerOpDezelfdeManier() {
  //Loop langs alle mogelijke oogkleuren
  mogelijkeOogKleuren.forEach(mogelijkeOogKleur => {
    //Als de gegeven oogkleur een bestaande oogkleur is voeg toe aan array
    if(oogKleur.indexOf(mogelijkeOogKleur) >= 0) { 
      tempOogkleuren.push(mogelijkeOogKleur);
    }
  });

  //Als er meerdere oogkleuren zijn, zet er een streepje tussen
  if(tempOogkleuren.length > 1) {
    nieuweOogKleurNotatie = camelCase(tempOogkleuren[0], {pascalCase: true}) + " - " 
        + camelCase(tempOogkleuren[1], {pascalCase: true});
    oogKleur = nieuweOogKleurNotatie;
    changeKey(1, oogKleur);
  } else {
    //Als de oogkleuren lijst leeg is en dus een oogkleur was ingevuld die niet bestaat, verander naar "Geen Antwoord"
    nieuweOogKleurNotatie = "Geen Antwoord"
    oogKleur = nieuweOogKleurNotatie;
    changeKey(1, oogKleur);
  }
  tempOogkleuren.length = 0;

}

function wijzigOogkleur() {
    oogKleur = String(old_key[Object.keys(old_key)[1]]).toLowerCase();

    verwijderDonkerLicht();
    //Veranderd elke eerste letter van de oogKleur naar een hoofdletter
    changeKey(1, camelCase(oogKleur, {pascalCase: true}));
    noteerOpDezelfdeManier();
}

function wijzigKledingKleuren() {
  kledingKleuren = String(old_key[Object.keys(old_key)[8]]).toLowerCase();
  kledingKleuren = sortList(kledingKleuren);
  changeKey(8, String(kledingKleuren));
}

//Kijkt of de oogKleur en kleuren van kleding hetzelfde zijn
function vergelijkKleuren() {
  kledingKleuren.forEach(kledingKleur => {
    if(oogKleur.toLowerCase() == kledingKleur.toLowerCase()) {
      aantalOvereenkomsten++;
    }
  });
  totaalAantalKleren += kledingKleuren.length;

  komenKleurenOvereen = String(kledingKleuren).toLowerCase().indexOf(oogKleur.toLowerCase()) >= 0;
  if(komenKleurenOvereen) {
    console.log(`Oogkleur komt WEL overeen met 1 van de kledingstukken.`);
  } else {
    console.log("Oogkleur komt NIET overeen met 1 van de kledingstukken.");
  }
}

//Berekend het aantal procent van overeenkomsten met oogkleur en totaal aantal kleren
function berekenOvereenkomsten() {
  overeenkomstenInProcenten = (aantalOvereenkomsten / totaalAantalKleren) * 100;
  console.log(`${aantalOvereenkomsten}/${totaalAantalKleren} (${overeenkomstenInProcenten.toFixed(2)}%) van alle kleren hebben zelfde kleur als de oogkleur(en) van de gebruikers.`);  
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
      console.log(veld)
      veld = veld.replace(filterChars, '');
      changeKey(j, veld);
     }
  }
}
//Bron https://thispointer.com/javascript-check-if-string-contains-special-characters/

app.get('/', function (req, res) {
  aantalGebruikers = 1;
  kleurenVerbanden = 0;
  for(i = 0; i < dataset.length; i++) {

    console.log(`--- Gebruiker ${aantalGebruikers} ---------------------------------------------------------`);
    old_key = dataset[i];
    new_key = old_key;

    wijzigOogkleur();
    wijzigKledingKleuren();
    vergelijkKleuren();
    vervangLegeVelden();
    vervangRareChars();

    // console.log(`Wat is je oogkleur? : ${dataset[i]["Wat is je oogkleur?"]}`);
    // console.log(`Welke kleur kledingstukken heb je aan vandaag? : ${dataset[i][ "Welke kleur kledingstukken heb je aan vandaag? (Meerdere antwoorden mogelijk natuurlijk...)"]}`);
    
    console.log(dataset[i]);

    aantalGebruikers++;
  }

  berekenOvereenkomsten();

  //__dirname zorgt ervoor dat het automatisch naar mijn project folder ga
  res.sendFile(path.join(__dirname+'/index.html'), {});
})
 
app.listen(3000);