import React, { useEffect } from "react";
import * as d3 from "d3";

const Lesson03 = () => {
  useEffect(() => {
    const mockData = [
      {
        width: 200,
        height: 400,
        fill: "tomato",
      },
      {
        width: 100,
        height: 250,
        fill: "purple",
      },
      {
        width: 50,
        height: 100,
        fill: "yellow",
      },
    ];

    // select the svg conatiner first
    const svg = d3.select("svg");

    // join the data to rects
    const rect = svg
      .selectAll("rect")
      .data(mockData)
      .attr("width", (data, i, n) => data.width)
      .attr("height", (data) => data.height)
      .attr("fill", (data) => data.fill);

    // add attrs to rects already in the DOM
    rect
      .attr("width", (data, i, n) => data.width)
      .attr("height", (data) => data.height)
      .attr("fill", (data) => data.fill);

    // append the enter selection to the DOM
    rect
      .enter()
      .append("rect")
      .attr("width", (data, i, n) => data.width)
      .attr("height", (data) => data.height)
      .attr("fill", (data) => data.fill);
  }, []);

  return (
    <div className="canvas">
      <svg width="600" height="600">
        <rect></rect>
      </svg>
    </div>
  );
};

export default Lesson03;
