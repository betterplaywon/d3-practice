import React, { useEffect } from "react";
import * as d3 from "d3";

const Lesson04 = () => {
  useEffect(() => {
    const svg = d3.select("svg");

    // scale 생성 => 높은 값을 상대적으로 처리
    const y = d3.scaleLinear().domain([0, 1000]).range([0, 200]);

    d3.json("./food.json").then((data) => {
      const rect = svg.selectAll("rect").data(data);

      rect
        .attr("width", 50)
        .attr("height", (d) => y(d.orders))
        .attr("fill", "orange")
        .attr("x", (d, i) => i * 70);

      rect
        .enter()
        .append("rect")
        .attr("width", 50)
        .attr("height", (d) => y(d.orders))
        .attr("fill", "orange")
        .attr("x", (d, i) => i * 70);
    });
  }, []);

  return (
    <div className="canvas">
      <svg width="600" height="600">
        <rect></rect>
      </svg>
    </div>
  );
};

export default Lesson04;
