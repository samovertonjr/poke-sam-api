const express = require("express");
const fetch = require("isomorphic-fetch");

const app = express();

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (_, res) => {
  res.status(401).send({
    errors: [
      {
        status: 401,
        title: "Not Found",
        detail: "The requested uri was not found."
      }
    ]
  });
});

app.get("/pokemon", (_, res) => {
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=150`;
  fetch(url)
    .then(response => response.json())
    .then(response => {
      const pokemon = response.results.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      res.send(pokemon);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Error has occurred");
    });
});

app.get("/pokemon/:id", (req, res) => {
  const id = req.params.id || "ditto";

  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  fetch(url)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      const { height, weight } = response;
      const pokeImage = response.sprites.front_default;
      const moves = response.moves.map(move => {
        return move["move"].name;
      });
      const types = response.types.map(type => {
        return type["type"].name;
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

    .catch(error => {
      console.log(error);
      res.status(500).send("Error has occurred");
    });
});

const portNumber = process.env.PORT || 8000;

app.listen(portNumber, () => {
  console.log(`listening on ${portNumber}`);
});
