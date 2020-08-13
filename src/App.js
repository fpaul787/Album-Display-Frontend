import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Cards from "./components/Cards/Cards";
import Loader from "./components/Loader/Loader";
import ScrollArrow from "./components/ScrollArrow/ScrollArrow";
import InfiniteScroll from "react-infinite-scroll-component";
import { FiSearch } from "react-icons/fi";

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
  const [totalFilteredAlbums, setTotalFilteredAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [numFilteredAlbums, setNumFilteredAlbums] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [years, setYears] = useState([""]);
  const [hasMore, setHasMore] = useState(true);
  const [rowsPerPage] = useState(2);
  const [userInput, setUserInput] = useState("");

  // new stuff for later
  const [query, setQuery] = useState("");
  

  useEffect(() => {
    let cardsPerRow = 3;
    const fetchData = async () => {
      setIsLoading(true);

      let response = null;

      // else
      if (query !== "") {

        let URL = ""
        if (years.indexOf(query) > -1 ){
          URL = `http://albums-api.frantzapps.xyz/api/album/year/${query}/`;
        }else{
          URL = `http://albums-api.frantzapps.xyz/api/album/albums/?search=${query}`;
        }

        response = await axios(
          URL
        );

        if (response.data.length >= 6) {
          setHasMore(true);
        }
      } else {

        response = await axios(
          "http://albums-api.frantzapps.xyz/api/album/albums/"
        );

        if (response.data.length >= 6) {
          setHasMore(true);
        }
      }
      let tempAmt = response.data.length - response.data.length * 2; // 2016 y parte de 2015???
      let newAlbums = generateRows(cardsPerRow, response.data.slice(tempAmt));

      setTotalFilteredAlbums(newAlbums.slice(0));

      // shallow copy of newAlbums
      setFilteredAlbums(newAlbums.slice(0, rowsPerPage));

      // number of filtered albums
      setNumFilteredAlbums(response.data.slice(tempAmt).length);

      filterYears(response.data.slice(tempAmt));

      // Data is available
      setIsLoading(false);
    };

    fetchData();
  }, [rowsPerPage, query]);

  const fetchAlbums = () => {
    // copy albums
    let albs = totalFilteredAlbums.slice(0);

    // copy albums from [filteredAlbums.length....albums.length - 1]
    albs = albs.slice(filteredAlbums.length);

    let filteralbs = [];
    if (albs.length >= rowsPerPage) {
      filteralbs = filteredAlbums.concat(albs.splice(0, rowsPerPage));
      setFilteredAlbums(filteralbs);
      setHasMore(true);
    } else {
      filteralbs = filteredAlbums.concat(albs.splice(0));
      setFilteredAlbums(filteralbs);

      setHasMore(false);
    }
  };

  const filterYears = (tmpAlbums) => {
    let tmpYears = [];

    for (let i = 1980; i < 2017; i++) {
      tmpYears.push(i.toString());
    }

    setYears(tmpYears);
  };

  const handleChange = (searchQuery) => {
    setQuery(searchQuery);
    setUserInput("");
  };

  const handleYearChange = (searchYear) => {
    setQuery(searchYear)
    setQuery(searchYear);
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
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleChange(userInput);
                  }
                }}
                value={userInput}
                className="form-control"
                placeholder="Search Album Name or Artist"
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
              />
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  handleChange(userInput);
                }}
              >
                <FiSearch />
              </button>
            </div>

            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                handleChange("");
              }}
            >
              Show All Albums
            </button>
          </div>

          <div className="results">
            <select
              className="custom-select"
              onChange={(e) => {
                handleYearChange(e.target.value);
              }}
            >
              <option value="DEFAULT">Choose a year to filter ...</option>
              {years.map((year) => {
                return (
                  <option
                    key={year}
                    className="dropdown-item"
                    value={year}                    
                  >
                    {year}
                  </option>
                );
              })}
            </select>
            
            
            <div className="amt">
              <h3 className="btn btn-primary">
                Albums{" "}
                <span className="badge badge-light">{numFilteredAlbums}</span>
              </h3>
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

          <ScrollArrow />
        </div>
      )}
    </div>
  );
}

export default App;
