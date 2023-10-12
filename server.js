// const express = require('express');
// const app = express();
// const port = 3000;
// const mysql = require('mysql2');
// const cors = require('cors');

// // Database connection configuration
// const dbConfig = {
//   host: 'brickmaster.database.windows.net',
//   port: 3306,
//   database: 'Brickdata',
//   user: 'brickmaster',
//   password: 'aSeNa@1234+',
//   options: {
//     encrypt: true, // For secure connection
// },
// };

// const db = mysql.createPool(dbConfig);

// app.use(cors());
// // Middleware to parse JSON requests
// app.use(express.json());

// // Define a route to submit user scores
// app.post('/api/submit-user-data', async (req, res) => {
//   try {
//     const { username, score } = req.body;

//     db.query('INSERT INTO scores (username, score) VALUES (?, ?)', [username, score], (err, result) => {
//       if (err) {
//         console.error('Error:', err);
//         res.status(500).json({ error: 'Internal server error' });
//       } else {
//         res.json({ message: 'Score submitted successfully' });
//       }
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/api/top-scores', (req, res) => {
//   const sql = 'SELECT username, score FROM scores ORDER BY score DESC LIMIT 5';

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error:', err);
//       res.status(500).json({ error: 'Internal server error' });
//     } else {
//       res.json(results);
//     }
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = new sqlite3.Database('score_table.db');
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, score INTEGER)');

app.post('/save-score', (req, res) => {
  const name = req.body.username;
  const score = req.body.score;

  console.log(`name: ${name}, score: ${score}`);

  const insertQuery = 'INSERT INTO users (name, score) VALUES (?, ?)';
  db.run(insertQuery, [name, score], (err) => {
      if (err) {
          res.status(500).send('Error saving user data');
        } else {
            res.send('Score and Username saved to the database.');
        }
    });
});

app.get('/getUserData', (req, res) => {
  const query = 'SELECT * FROM users';
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).send('Error fetching score table');
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


