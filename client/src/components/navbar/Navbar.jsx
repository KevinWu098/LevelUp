import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest.js";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/gigs?search=${input}`);
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logoSearch">
          <div className="logo">
            <Link className="link" to="/">
              <span className="text">Level Up</span>
            </Link>
            <span className="dot">.</span>
          </div>
          {pathname !== "/" ? (
            <div>
              <form action="submit" onSubmit={(e) => handleSubmit(e)}>
                <div className="search">
                  <div className="searchContainer">
                    <div className="searchInput">
                      <input
                        type="text"
                        className="textInput"
                        onChange={(e) => setInput(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={(e) => handleSubmit(e)}
                      className="buttonInput"
                    >
                      <img src="./img/search.png" alt="" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : null}
        </div>
        <div className="links">
          <Link className="link" to="/gigs">
            <span>Explore</span>
          </Link>
          {/* {!currentUser?.isSeller && <span>Become a Seller</span>} */}
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="Avatar" />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Orders
                  </Link>
                  <Link className="link" to="/messages">
                    Messages
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/gigs?search=League of Legends">
              League of Legends
            </Link>
            <Link className="link menuLink" to="/gigs?search=Overwatch">
              Overwatch
            </Link>
            <Link className="link menuLink" to="/gigs?search=Valorant">
              Valorant
            </Link>
            <Link className="link menuLink" to="/gigs?search=Aim Training">
              Aim Training
            </Link>
            <Link className="link menuLink" to="/gigs?search=Fortnite">
              Fortnite
            </Link>
            <Link className="link menuLink" to="/gigs?search=Apex Legends">
              Apex Legends
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
