const express = require('express');
const axios = require('axios');

const app = express();

app.get('/', (req, res) => {
  console.log(res);

  res.status(401).send({
    errors: [{ status: 401, title: 'Not Found', detail: 'The requested uri was not found.' }]
  });
});

app.get('/pokemon', (req, res) => {
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=150`;
  axios
    .get(url)
    .then((response) => {
      const pokemon = response.data.results.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
      res.send(pokemon);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error has occurred');
    });
});

app.get('/pokemon/:id', (req, res) => {
  const id = req.params.id || 'ditto';

  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  axios
    .get(url)
    .then((response) => {
      const { height, weight } = response.data;
      const pokeImage = response.data.sprites.front_default;
      const moves = response.data.moves.map((move) => {
        return move['move'].name;
      });
      const types = response.data.types.map((type) => {
        return type['type'].name;
      });

      res.send({
        results: {
          height,
          weight,
          moves,
          types,
          pokeImage
        }
      });
    })

    .catch((error) => {
      console.log(error);
      res.status(500).send('Error has occurred');
    });
});

const portNumber = process.env.PORT || 8000;

app.listen(portNumber, () => {
  console.log(`listening on ${portNumber}`);
});
