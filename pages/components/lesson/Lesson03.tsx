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
    ];

    const canvas = d3.select(".canvas");

    if (canvas.select("svg")) {
      canvas.select("svg").remove();
    }

    const svg = canvas.append("svg");
    const rect = svg
      .append("rect")
      .data(mockData)
      .attr("width", (data, i, n) => data.width)
      .attr("height", (data) => data.height)
      .attr("fill", (data) => data.fill);
  }, []);

  return (
    <div className="canvas">
      <rect></rect>
    </div>
  );
};

export default Lesson03;
