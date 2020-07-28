import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Cards from "./components/Cards/Cards";
import Loader from "./components/Loader/Loader";

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
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cardsPerRow = 3;
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios("http://127.0.0.1:8000/api/album/albums/");

      let newAlbums = generateRows(
        cardsPerRow,
        result.data.slice(result.data.length - 200)
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
        <div className="right">
          <div className="searchbar ">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search Album Name or Artist"
              />
            </div>
          </div>

          <div className="albums">
            {albums.map((row, index) => {
              return <Cards key={index} data={row} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
