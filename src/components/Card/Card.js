import React from "react";
import default_img from "../../assets/default.jpg";
import "./card-style.css";
const Card = (props) => {
  // console.log(props.album.album_cover);
  var { album } = props;

  return (
    <div className="card text-center shadow">
      <div className="overflow">
        <img
          src={album.cover ? album.cover : default_img}
          alt="Image1"
          className="card-img-top"
        />
      </div>
      <div className="card-body text-dark">
        <h4 className="card-title">{album.name ? album.name : "No Title"}</h4>
        {/* <p className="card-text text-secondary">
          Lorem ipsum Lorem ipsum Lorem ipsum
        </p> */}
        <div className="card-body-bio">
          <h5 className="card-subtitle mb-2 text-muted">
            Artist:
            <span id="artist"> {album.artist}</span>
          </h5>

          <h5 className="card-subtitle mb-2 text-muted">
            Release Date:
            <span id="release-date">{album.release_date}</span>
          </h5>
        </div>

        <p className="btn btn-outline-success">Album Info</p>
      </div>
    </div>
  );
};

export default Card;
