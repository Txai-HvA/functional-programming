const express = require('express')
const camelCase = require('camelcase');
const app = express()
const path = require('path');
const router = express.Router();
app.use(express.static('public/css'));
 
const fs = require('fs')
const jsonString = fs.readFileSync('./tech-track-dataset.json')
const dataset = JSON.parse(jsonString)
//Bron https://medium.com/@osiolabs/read-write-json-files-with-node-js-92d03cc82824

// Variabellen
let old_key;
let new_key;
let userCount = 0;
let oogKleur;
let kledingKleuren;
let list = [];


function sortList(givenList) {
  //Checked of het gegeven antwoord komma's bevat en dus een lijst is
  if(String(givenList).indexOf(',') >= -1) {
    //Split antwoorden op komma
    list = givenList.split(", ");
    //Sorteert op alfabetische volgorde
    list.sort()
    //Geef de lijst terug en zet het om naar een String
    return list
  }
}

// Veranderd de waarde van het gegeven antwoord 
function changeKey(vraagNummer, nieuweWaarde) {
  new_key[Object.keys(new_key)[vraagNummer]] = nieuweWaarde;
  Object.defineProperty(dataset[i], new_key, {});
  console.log(dataset[i]);
}

function wijzigOogkleur() {
    oogKleur = String(old_key[Object.keys(old_key)[1]]).toLowerCase();

    //Veranderd elke eerste letter van de oogKleur naar een hoofdletter
    changeKey(1, camelCase(oogKleur, {pascalCase: true}));

    //Als de oogKleur Donkerbruin is, verander het naar Bruin
    if(oogKleur == "donkerbruin") {
      changeKey(1, "Bruin");
    } 

    //Als de oogKleur Groen - Grijs/Blauw is, noteer het op dezelfde manier
    if(oogKleur.indexOf('groen') >= 0) {
      if(oogKleur.indexOf('grijs') >= 0) {
        changeKey(1, "Groen - Grijs");
      }

      if(oogKleur.indexOf('blauw') >= 0) {
        changeKey(1, "Groen - Blauw");
      }
    }
}

function wijzigKledingKleren() {
  kledingKleuren = String(old_key[Object.keys(old_key)[8]]).toLowerCase();
  kledingKleuren = sortList(kledingKleuren);
}

//Kijkt of de oogKleur en kleuren van kleding hetzelfde zijn
function vergelijkKleuren() {
  if(kledingKleuren.indexOf(oogKleur) >= 0) {
    console.log(`Oogkleur komt overeen met 1/${kledingKleuren.length} van de kleding stukken`)
  } else {
    console.log("Oogkleur komt NIET overeen met 1 van de kleding stukken")
  }
}


app.get('/', function (req, res) {

  userCount = 1;
  for(i = 0; i < dataset.length; i++) {

    old_key = dataset[i];
    new_key = old_key;


    wijzigOogkleur();
    wijzigKledingKleren();
    vergelijkKleuren();

    userCount++;
  }

  //__dirname zorgt ervoor dat ik automatisch naar mijn project folder ga
  res.sendFile(path.join(__dirname+'/index.html'), dataset);
})
 
app.listen(3000);