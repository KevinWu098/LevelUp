import React from "react";
import "./TrustedBy.scss";

const TrustedBy = () => {
  return (
    <div className="trustedBy">
      <div className="container">
        <span>Trusted by:</span>
        <img src="../../../public/img/opgg.png" alt="op.gg" />
        <img src="../../../public/img/blitz.png" alt="blitz.gg" />
        <img src="../../../public/img/porofessor.png" alt="porofessor" />
      </div>
    </div>
  );
};

export default TrustedBy;
