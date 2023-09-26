import React, { useEffect } from "react";
import * as d3 from "d3";

const Lesson02 = () => {
  useEffect(() => {
    const canvas = d3.select(".canvas");
    const svg = canvas.append("svg");

    svg.append("rect");
    svg.append("circle");
  }, []);

  return <div className="canvas"></div>;
};

export default Lesson02;
