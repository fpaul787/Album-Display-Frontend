import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Cards from "./components/Cards/Cards";
import Loader from "./components/Loader/Loader";
import ScrollArrow from "./components/ScrollArrow/ScrollArrow";
import InfiniteScroll from "react-infinite-scroll-component";

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
  const [totalFilteredAlbums, setTotalFilteredAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [numFilteredAlbums, setNumFilteredAlbums] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [years, setYears] = useState(["All"]);
  const [buttonText, setButtonText] = useState("Year");
  const [hasMore, setHasMore] = useState(true);
  const [rowsPerPage] = useState(2);

  useEffect(() => {
    let cardsPerRow = 3;
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios("http://127.0.0.1:8000/api/album/albums/");

      let tempAmt = result.data.length - result.data.length * 2; // 2016 y parte de 2015???
      let newAlbums = generateRows(cardsPerRow, result.data.slice(tempAmt));

      setAlbums(newAlbums);

      setTotalFilteredAlbums(newAlbums.slice(0));

      // shallow copy of newAlbums
      setFilteredAlbums(newAlbums.slice(0, rowsPerPage));

      // number of filtered albums
      setNumFilteredAlbums(result.data.slice(tempAmt).length);

      filterYears(result.data.slice(tempAmt));

      // Data is available
      setIsLoading(false);
    };

    fetchData();
  }, [rowsPerPage]);

  const fetchAlbums = () => {
    // copy albums
    let albs = totalFilteredAlbums.slice(0);

    // copy albums from [filteredAlbums.length....albums.length - 1]
    albs = albs.slice(filteredAlbums.length);

    // console.log(albums);
    let filteralbs = [];
    if (albs.length >= rowsPerPage) {
      filteralbs = filteredAlbums.concat(albs.splice(0, rowsPerPage));
      setFilteredAlbums(filteralbs);

      setHasMore(true);
    } else {
      // filteralbs = filteredAlbums.concat(albs.splice(0));
      setHasMore(false);
    }
  };

  const filterYears = (tmpAlbums) => {
    let tmpYears = ["All"];

    tmpAlbums.forEach((album) => {
      // console.log(album.name + " || " + album.release_date.substring(0, 4));
      let dateReleased = new Date(album.release_date.substring(0, 4));
      // console.log(dateReleased);
      if (!tmpYears.includes(dateReleased.getFullYear())) {
        // console.log(album.name + " || " + album.release_date.substring(0, 4));

        tmpYears.push(dateReleased.getFullYear());
      }
    });

    setYears(tmpYears);
  };

  const handleChange = (e) => {
    let albumsArr = [];

    let searchQuery = e.target.value.toLowerCase();
    if (searchQuery === "") {
      setFilteredAlbums(albums);

      let lastRowLength = albums[albums.length - 1].length - 3;
      setNumFilteredAlbums(albums.length * 3 + lastRowLength);
    } else {
      albums.forEach((albumRow) =>
        albumRow.forEach((album) => {
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

  const handleDateChange = (e) => {
    let albumsArr = [];

    if (e.target.textContent === "All") {
      albums.forEach((albumRow) =>
        albumRow.forEach((album) => {
          albumsArr.push(album);
        })
      );
    } else {
      albums.forEach((albumRow) =>
        albumRow.forEach((album) => {
          let dateReleased = new Date(album.release_date);

          if (dateReleased.getFullYear().toString() === e.target.textContent) {
            albumsArr.push(album);
          }
        })
      );
    }

    // shallow copy of newAlbums
    // setFilteredAlbums(newAlbums.slice(0, rowsPerPage));

    // number of filtered albums
    // setNumFilteredAlbums(result.data.slice(tempAmt).length);

    let cardsPerRow = 3;
    let newAlbs = generateRows(cardsPerRow, albumsArr);
    setTotalFilteredAlbums(newAlbs.slice(0));

    setFilteredAlbums(newAlbs.slice(0, rowsPerPage));
    setNumFilteredAlbums(albumsArr.length);
    setButtonText(e.target.textContent);
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
            <div className="amt">
              <h3 className="btn btn-primary">
                Albums{" "}
                <span className="badge badge-light">{numFilteredAlbums}</span>
              </h3>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle dropdownBtn"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {buttonText}
              </button>

              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {years.map((year) => {
                  return (
                    <button
                      key={year}
                      className="dropdown-item"
                      onClick={(e) => {
                        handleDateChange(e);
                      }}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="albums">
            <InfiniteScroll
              dataLength={filteredAlbums.length}
              hasMore={hasMore}
              next={fetchAlbums}
              loader={
                <div className="center">
                  <Loader />
                </div>
              }
            >
              {filteredAlbums.map((row, index) => {
                return <Cards key={index} data={row} />;
              })}
            </InfiniteScroll>
          </div>

          <ScrollArrow className="scrollBtn" />
        </div>
      )}
    </div>
  );
}

export default App;
