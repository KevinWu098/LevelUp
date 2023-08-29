import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";

function Featured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the ultimate <span>coaches, guides</span>, and{" "}
            <span>tips</span> to rank up.
          </h1>
          <form action="submit" onSubmit={handleSubmit}>
            <div className="search">
              <div className="searchContainer">
                <img src="./img/search.png" alt="" />
                <div className="searchInput">
                  <input
                    type="text"
                    placeholder='Try "Valorant Coaching"'
                    className="textInput"
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
              </div>
              <button onClick={handleSubmit}>Search</button>
            </div>
          </form>
          <div className="popular">
            <span>Popular:</span>
            <button>League of Legends</button>
            <button>Overwatch</button>
            <button>Valorant</button>
            {/* <button>AI Services</button> */}
          </div>
        </div>
        <div className="right">{/* <img src="./img/man.png" alt="" /> */}</div>
      </div>
    </div>
  );
}

export default Featured;
