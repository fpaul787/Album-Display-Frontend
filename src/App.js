import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Cards from "./components/Cards/Cards";
import Loader from "./components/Loader/Loader";
import "bootstrap/dist/css/bootstrap.min.css";

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

  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios("http://127.0.0.1:8000/api/album/albums/");

      let newAlbums = generateRows(
        cardsPerRow,
        result.data.slice(result.data.length - 100)
      );
      setAlbums(newAlbums);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="center">
          <Loader />
        </div>
      ) : (
        <div className="App">
          {albums.map((row, index) => {
            return <Cards key={index} data={row} />;
          })}
        </div>
      )}
    </div>
  );
}

export default App;
