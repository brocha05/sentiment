const express = require("express");
const lorca = require('lorca-nlp');
const path = require('path');
var cors = require('cors')
var Analyzer = require('natural').SentimentAnalyzer;

var stemmer = require('natural').PorterStemmer;
var analyzer = new Analyzer("Spanish", stemmer, "afinn");

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors()) 
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.static(path.resolve(__dirname, '../sentiment/build')));

let eval = [];
const evaluar = (comentarios) => {
    let array = [];
    let sentimientos = [];
    for (let i = 0; i < comentarios.length; i++){
        array.push(comentarios[i].toString().split(" "))
    }
    for (let i = 0; i < comentarios.length; i++){
        sentimientos.push(analyzer.getSentiment(array[i]))
    }
    return sentimientos;
}

app.post("/api", (req, res) => {
    eval = req.body 
    let sentimientos = evaluar(eval)
    res.json({  
        array: sentimientos
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../sentiment/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

