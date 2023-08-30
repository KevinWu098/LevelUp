import React from "react";
import "./TrustedBy.scss";

const TrustedBy = () => {
  return (
    <div className="trustedBy">
      <div className="container">
        <span>Trusted by:</span>
        <img src="/img/opgg.png" alt="op.gg" />
        <img src="/img/blitz.png" alt="blitz.gg" />
        <img src="/img/porofessor.png" alt="porofessor" />
      </div>
    </div>
  );
};

export default TrustedBy;
