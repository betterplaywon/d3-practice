import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useStackedBarChart } from "../../hooks/use-stacked-bar-chart";
import { StackedBarDatum } from "../../api/charts";

const WIDTH = 750;
const HEIGHT = 500;
const MARGIN = { top: 50, right: 30, bottom: 80, left: 70 };

const StackedBarChart = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useStackedBarChart();

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = d3.select(canvasRef.current);
    canvas.select("svg").remove();

    const graphWidth = WIDTH - MARGIN.left - MARGIN.right;
    const graphHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

    const svg = canvas.append("svg").attr("width", WIDTH).attr("height", HEIGHT);

    const graph = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

    const stack = d3.stack<StackedBarDatum>().keys(data.keys);
    const stackedData = stack(data.data as never);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(data.keys)
      .range(data.colors);

    const x = d3
      .scaleBand<string>()
      .domain(data.data.map((d) => d.quarter as string))
      .range([0, graphWidth])
      .padding(0.2);

    const yMax = d3.max(stackedData[stackedData.length - 1], (d) => d[1]) ?? 0;
    const y = d3.scaleLinear().domain([0, yMax * 1.05]).range([graphHeight, 0]);

    // X축
    graph
      .append("g")
      .attr("transform", `translate(0, ${graphHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("font-size", "12px");

    // Y축
    graph
      .append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("font-size", "12px");

    // 수평 그리드
    const gridGroup = graph
      .append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(-graphWidth).tickFormat(() => ""));
    gridGroup.selectAll("line").attr("stroke", "#e0e0e0").attr("stroke-dasharray", "3,3");
    gridGroup.select(".domain").remove();

    // 스택 레이어 렌더링
    stackedData.forEach((layer) => {
      const key = layer.key;
      graph
        .selectAll<SVGRectElement, d3.SeriesPoint<StackedBarDatum>>(`.bar-layer-${key}`)
        .data(layer)
        .enter()
        .append("rect")
        .attr("class", `bar-layer-${key}`)
        .attr("x", (d) => x(d.data.quarter as string) ?? 0)
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .attr("fill", colorScale(key));
    });

    // 범례
    const legendY = HEIGHT - MARGIN.bottom + 30;
    const legendGroup = svg.append("g").attr("transform", `translate(${MARGIN.left}, ${legendY})`);

    data.keys.forEach((key, i) => {
      const g = legendGroup.append("g").attr("transform", `translate(${i * 110}, 0)`);
      g.append("rect").attr("width", 14).attr("height", 14).attr("rx", 2).attr("fill", colorScale(key));
      g.append("text").attr("x", 18).attr("y", 11).attr("font-size", "12px").attr("fill", "#333").text(key);
    });

    // 제목
    svg
      .append("text")
      .attr("x", WIDTH / 2)
      .attr("y", MARGIN.top - 14)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text(data.label);

    return () => {
      canvas.select("svg").remove();
    };
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading chart data</div>;

  return <div ref={canvasRef} />;
};

export default StackedBarChart;
