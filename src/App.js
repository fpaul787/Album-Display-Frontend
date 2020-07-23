import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Cards from "./components/Cards/Cards";
import "bootstrap/dist/css/bootstrap.min.css";

import img from "./assets/2_Low_Life_Muthas.jpg";

function generateData(cardsPerRow) {
  let data = [];

  for (let i = 0; i < 6; i++) {
    data.push({
      id: i,
      name: "Sugarhill Gang (album)",
      release_date: "1980-2-7",
      artist: "The Sugarhill Gang",
      album_cover: i % 2 ? img : null,
    });
  }

  let rows = [];
  var amtOfRows = data.length / cardsPerRow;

  for (let i = 0; i < amtOfRows; i++) {
    rows.push(data.slice(i * cardsPerRow, i * cardsPerRow + 3));
  }
  return rows;

  // return data;
}

function generateRows(cardsPerRow, dataArray) {
  let data = dataArray;

  let rows = [];
  var amtOfRows = data.length / cardsPerRow;

  for (let i = 0; i < amtOfRows; i++) {
    rows.push(data.slice(i * cardsPerRow, i * cardsPerRow + 3));
  }
  return rows;
}

function App() {
  let cardsPerRow = 3;
  var data = generateData(cardsPerRow);

  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios("http://127.0.0.1:8000/api/album/albums/");

      let newAlbums = generateRows(
        cardsPerRow,
        result.data.slice(result.data.length - 6)
      );
      setAlbums(newAlbums);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>
          <h1>Loading ...</h1>
        </div>
      ) : (
        <div className="App">
          {/* <h1>{console.log(albums)}</h1> */}
          {albums.map((row, index) => {
            return <Cards key={index} data={row} />;
          })}
        </div>
      )}
    </div>
  );
}

export default App;
