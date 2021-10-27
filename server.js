const express = require('express')
const camelCase = require('camelcase');
const app = express()
 
const fs = require('fs')
const jsonString = fs.readFileSync('./tech-track-dataset.json')
const dataset = JSON.parse(jsonString)
//Bron https://medium.com/@osiolabs/read-write-json-files-with-node-js-92d03cc82824
let oudeDataset;
let nieuweDataset = [];

// Variabellen
let userCount = 1;
let questions = [];
let answers = [];
let list = [];

function convertToList(givenList) {
  //Checked of het gegeven antwoord komma's bevat en dus een lijst is
  if(String(givenList).indexOf(',') >= -1) {
    //Split antwoorden op komma
    list = givenList.split(", ");
    //Sorteert op alfabetische volgorde
    list.sort()
    return list
  }
}

let old_key;
let new_key;

let oogKleur;

app.get('/', function (req, res) {


  for(i = 0; i < dataset.length; i++) {

    old_key = dataset[i];
    new_key = old_key;


    oogKleur = String(old_key[Object.keys(old_key)[1]]);

    if(oogKleur == "donkerbruin") {

      
      new_key[Object.keys(new_key)[1]] = "test";

      Object.defineProperties(
        dataset[i],
        new_key,
        Object.getOwnPropertyDescriptor(dataset[i], old_key)
      )
      delete dataset[i][old_key];

      
    }  
    console.log(dataset[i])

    // if(oogKleur.indexOf('-') >= 0) {
    //   console.log("streepje")
    // }

  }

  res.send("test");
})
 
app.listen(3000);