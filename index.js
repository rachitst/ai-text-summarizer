const express = require('express');
const natural = require('natural');
const app = express();
const port = 3000;
const summarizeText = require('./summarize.js');

app.use(express.json());

app.use(express.static('public'));

app.post('/summarize', (req, res) => {
  const text = req.body.text_to_summarize;
  summarizeText(text) 
    .then(response => {
       res.send(response); 
    })
    .catch(error => {
      console.log(error.message);
    });
});

app.post('/extract_keywords', (req, res) => {
  const text = req.body.text;
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  const tfidf = new natural.TfIdf();

  tfidf.addDocument(text);
  const keywords = [];

  tfidf.listTerms(0).forEach((term) => {
    if (term.tfidf > 1.5) {
      keywords.push(term.term);
    }
  });

  res.json({ keywords });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

