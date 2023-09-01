import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest.js";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("createdAt");
  // const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: async () => {
      if (!search && !minRef.current.value && !maxRef.current.value) {
        var url = "/gigs";
      } else {
        url = `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}cat=`;
      }

      const res = await newRequest.get(url);
      return res.data;
    },
  });

  // const reSort = (type) => {
  //   setSort(type);
  //   setOpen(false);
  // };

  useEffect(() => {
    refetch();
  }, [sort, search]);

  const apply = () => {
    refetch();
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">Level Up &gt; Services &gt;</span>
        <h1>Services</h1>
        <p>
          Explore the countless options available on <span>Level Up</span>
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input
              ref={minRef}
              type="number"
              placeholder="min"
              onChange={apply}
            />
            <input
              ref={maxRef}
              type="number"
              placeholder="max"
              onChange={apply}
            />
            <button onClick={apply}>Apply</button>
          </div>
          {/* <div className="right">
            <span className="sortBy">Sort By:</span>
            <span className="sortType">
              {sort === "sales" ? "Popular" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Popular</span>
                )}
              </div>
            )}
          </div> */}
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong!"
            : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
