import React from "react";
import Card from "../Card/Card";
import "./cards-style.css";

export const Cards = ({ data }) => {
  // data.map((album) => {
  //   console.log(album);
  // });

  return (
    <div className="container">
      <div className="row mx-auto">
        {data.map((album) => {
          return (
            <div key={album.id} className="col-sm col-md-offset-3">
              <Card album={album} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cards;
