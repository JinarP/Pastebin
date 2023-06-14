const express = require('express');
const app = express();
const port = 3000;
let path    = require("path");
const client = require("./routes/databaseconection");
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(__dirname));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'views/startPage.html'));
});

app.get('/addtext', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/add.html'));
});

app.get('/readText', async (req, res) => {
  const { id } = req.query;
  try {
    const result = await client.query("SELECT text FROM document WHERE id = $1", [id]);
    const text = result.rows[0].text;
    res.send(text);
  } catch (error) {
    console.error('Eroare la interogare:', error);
    res.send('A apărut o eroare în interogare.');
  }
});
app.get('/textlist', async (req, res) => {
  try {
    const document = await client.query("SELECT text, id FROM document");
    let variable = "";
    document.rows.forEach(row => {
        variable += `${row.text.substring(0, 25)} <button onclick="window.location.href='/readText?id=${row.id}'">READ THIS TEXT</button> <br>`;
    });
    res.send(variable);
  } catch (error) {
    console.log(error);
  }
});

app.post('/form', async (req, res) => {
  try {
   let input = req.body.text;
   await client.query('INSERT INTO document (text) VALUES ($1)', [input]);
   res.sendFile(path.join(__dirname, 'views\\succesAdd.html'));
  } catch (error) {
     console.log(error);
  }
});

module.exports = app;
