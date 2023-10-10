import React, { useEffect } from "react";
import * as d3 from "d3";

const Lesson03 = () => {
  useEffect(() => {
    const svg = d3.select("svg");

    fetch("/planets.json") // Fetch data from public folder
      .then((response) => response.json()) // Parse it as JSON
      .then((data) => {
        // Now you can use D3 with the data:
        const circles = svg.selectAll("circle").data(data);

        // add attrs to rects already in the DOM
        circles
          .attr("cy", 200)
          .attr("cx", (d) => d.distance)
          .attr("r", (d) => d.radius)
          .attr("fill", (d) => d.fill);

        // append the enter selection to the DOM
        circles
          .enter()
          .append("circle")
          .attr("cy", 200)
          .attr("cx", (d) => d.distance)
          .attr("r", (d) => d.radius)
          .attr("fill", (d) => d.fill);
      });
  }, []);

  return (
    <div className="canvas">
      <svg width="600" height="600">
        <circle></circle>
      </svg>
    </div>
  );
};

export default Lesson03;
