import React, { useState, useEffect } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
import "./ScrollArrow.css";

const ScrollArrow = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  const checkScrollTop = () => {
    if (isRendered) {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsRendered(false);
  };

  window.addEventListener("scroll", checkScrollTop);

  return (
    <FaArrowCircleUp
      className="scrollTop"
      onClick={scrollTop}
      style={{
        marginLeft: "55%",
        height: 60,
        display: showScroll ? "flex" : "none",
      }}
    />
  );
};

export default ScrollArrow;
