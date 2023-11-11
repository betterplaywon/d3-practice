import React, { useEffect } from "react";
import * as d3 from "d3";

const Lesson04 = () => {
  useEffect(() => {
    const canvas = d3.select(".canvas");

    if (canvas.select("svg")) {
      canvas.select("svg").remove();
    }

    const svg = canvas.append("svg").attr("width", 600).attr("height", 600);

    // 너비 높이 설정
    const margin = { top: 20, bottom: 100, left: 100, right: 20 };
    const graphWidth = 600 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;

    // 차트 그룹화
    const graph = svg
      .append("g")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.json("./food.json").then((data) => {
      // scale 생성 => 높은 값을 상대적으로 처리
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.orders)])
        .range([0, 200]);

      // 그래프의 너비를 나타내는 이름 배열과 범위 전달
      const x = d3
        .scaleBand()
        .domain(data.map((item) => item.name))
        .range([0, 500])
        .paddingInner(0.2)
        .paddingOuter(0.2);

      const rect = graph.selectAll("rect").data(data);

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

  return <div className="canvas"></div>;
};

export default Lesson04;
