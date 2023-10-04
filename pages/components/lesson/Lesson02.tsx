import React, { useEffect } from "react";
import * as d3 from "d3";

const Lesson02 = () => {
  useEffect(() => {
    const canvas = d3.select(".canvas");

    const svg = canvas.append("svg").attr("width", 600).attr("height", 600);
    const group = svg.append("g").attr("transform", "translate(0,100)");

    group
      .append("rect")
      .attr("width", 200)
      .attr("height", 100)
      .attr("fill", "blue")
      .attr("x", 20)
      .attr("y", 20);

    group
      .append("circle")
      .attr("r", 35)
      .attr("cx", 350)
      .attr("cy", 70)
      .attr("fill", "pink");

    group
      .append("line")
      .attr("x1", 450)
      .attr("x2", 500)
      .attr("y1", 30)
      .attr("y2", 100)
      .attr("stroke", "red");

    svg
      .append("text")
      .attr("x", 20)
      .attr("y", 200)
      .attr("fill", "grey")
      .text("D3 practice");
  }, []);

  return <div className="canvas"></div>;
};

export default Lesson02;
