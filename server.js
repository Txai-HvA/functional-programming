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

// function removeWords(givenValue) {
//   console.log("oooooooooooooooooooooooooooooooo")
//   if(String(givenValue).indexOf('donker')) {
//     console.log("oooooooooooooooooooooooooooooooo")
//   }
// }

app.get('/', function (req, res) {

  oudeDataset = dataset;

  dataset.forEach(user => {

    questions = Object.keys(user);
    answers = Object.values(user);

    for(i = 0; i < questions.length; i++) {
      
      answers[i] = camelCase(String(answers[i]), {pascalCase: true});

      if(i == 8) {
        /*Als de vraag "Welke kleur kledingstukken heb je aan vandaag? 
        (Meerdere antwoorden mogelijk natuurlijk...)" is, zet antwoord om naar een Array */
        answers[i] = convertToList(answers[i]);
      }
    }

    userCount++;

    nieuweDataset.push(answers)
  });


//////////////////////////////WIP
// for(i = 0; i < dataset.length; i++) {

//     Object.defineProperties(
//       dataset[i],
//       nieuweDataset[i],
//       Object.getOwnPropertyDescriptor(dataset[i], oudeDataset[i])
//     )
//     delete dataset[i][oudeDataset[i]];
// }

  res.send("test");
})
 
app.listen(3000);