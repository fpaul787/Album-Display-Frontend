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
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [numFilteredAlbums, setNumFilteredAlbums] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cardsPerRow = 3;
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios("http://127.0.0.1:8000/api/album/albums/");

      let tempAmt = result.data.length - 499;
      let newAlbums = generateRows(cardsPerRow, result.data.slice(tempAmt));

      setAlbums(newAlbums);
      setFilteredAlbums(newAlbums);
      setNumFilteredAlbums(result.data.slice(tempAmt).length);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    let albumsArr = [];

    let searchQuery = e.target.value.toLowerCase();
    if (searchQuery === "") {
      setFilteredAlbums(albums);

      let lastRowLength = albums[albums.length - 1].length - 3;
      setNumFilteredAlbums(albums.length * 3 + lastRowLength);
    } else {
      albums.map((albumRow) =>
        albumRow.map((album) => {
          if (
            album.name.toLowerCase().includes(searchQuery) ||
            album.artist.toLowerCase().includes(searchQuery)
          ) {
            albumsArr.push(album);
          }
        })
      );

      let cardsPerRow = 3;
      setFilteredAlbums(generateRows(cardsPerRow, albumsArr));
      setNumFilteredAlbums(albumsArr.length);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="center">
          <Loader />
        </div>
      ) : (
        <div>
          <div className="searchbar ">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search Album Name or Artist"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          </div>

          <div className="results">
            <h3 className="btn btn-primary">
              Albums{" "}
              <span className="badge badge-light">{numFilteredAlbums}</span>
            </h3>
          </div>

          <div className="albums">
            {filteredAlbums.map((row, index) => {
              return <Cards key={index} data={row} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
