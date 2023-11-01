import React, { useEffect } from "react";
import * as d3 from "d3";

const Lesson04 = () => {
  useEffect(() => {
    const svg = d3.select("svg");

    // scale 생성 => 높은 값을 상대적으로 처리
    const y = d3.scaleLinear().domain([0, 1000]).range([0, 200]);

    d3.json("./food.json").then((data) => {
      const rect = svg.selectAll("rect").data(data);
      const foods = data.map((food: { name: string }) => food.name);
      // 그래프의 너비를 나타내는 이름 배열과 범위 전달
      const x = d3
        .scaleBand()
        .domain(foods)
        .range([0, 500])
        .paddingInner(0.2)
        .paddingOuter(0.2);

      rect
        .attr("width", x.bandwidth)
        .attr("height", (d) => y(d.orders))
        .attr("fill", "orange")
        .attr("x", (d) => x(d.name));

      rect
        .enter()
        .append("rect")
        .attr("width", x.bandwidth)
        .attr("height", (d) => y(d.orders))
        .attr("fill", "orange")
        .attr("x", (d) => x(d.name));
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
