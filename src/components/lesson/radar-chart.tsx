import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useRadarChart } from "../../hooks/use-radar-chart";

const WIDTH = 600;
const HEIGHT = 600;
const RADIUS = 200;

const RadarChart = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useRadarChart();

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = d3.select(canvasRef.current);
    canvas.select("svg").remove();

    const svg = canvas.append("svg").attr("width", WIDTH).attr("height", HEIGHT);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${WIDTH / 2}, ${HEIGHT / 2})`);

    const numAxes = data.axes.length;
    const maxVal = 100;

    const radialScale = d3.scaleLinear().domain([0, maxVal]).range([0, RADIUS]);

    // 동심원 그리드 (5단계)
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      chart
        .append("circle")
        .attr("r", (RADIUS / levels) * i)
        .attr("fill", "none")
        .attr("stroke", "#ddd")
        .attr("stroke-dasharray", "3,3");

      // 단계 레이블
      chart
        .append("text")
        .attr("x", 4)
        .attr("y", -((RADIUS / levels) * i) + 4)
        .attr("font-size", "10px")
        .attr("fill", "#aaa")
        .text(String(Math.round((maxVal / levels) * i)));
    }

    // 축 선 + 레이블
    data.axes.forEach((axisName, i) => {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const x = RADIUS * Math.cos(angle);
      const y = RADIUS * Math.sin(angle);

      chart
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1);

      chart
        .append("text")
        .attr("x", (RADIUS + 22) * Math.cos(angle))
        .attr("y", (RADIUS + 22) * Math.sin(angle))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "13px")
        .attr("fill", "#555")
        .text(axisName);
    });

    // 각 시리즈 다각형
    const lineGen = d3
      .line<{ x: number; y: number }>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveLinearClosed);

    data.series.forEach((series) => {
      const coords = series.values.map((val, i) => {
        const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
        return {
          x: radialScale(val) * Math.cos(angle),
          y: radialScale(val) * Math.sin(angle),
        };
      });

      chart
        .append("path")
        .datum(coords)
        .attr("d", lineGen)
        .attr("fill", series.color)
        .attr("fill-opacity", 0.2)
        .attr("stroke", series.color)
        .attr("stroke-width", 2);

      // 데이터 포인트 원
      coords.forEach(({ x, y }) => {
        chart
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 4)
          .attr("fill", series.color)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5);
      });
    });

    // 범례
    const legend = svg
      .append("g")
      .attr("transform", `translate(20, 20)`);

    data.series.forEach((series, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 22})`);
      row
        .append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("rx", 2)
        .attr("fill", series.color)
        .attr("fill-opacity", 0.7);
      row
        .append("text")
        .attr("x", 20)
        .attr("y", 11)
        .attr("font-size", "13px")
        .attr("fill", "#333")
        .text(series.name);
    });

    // 제목
    svg
      .append("text")
      .attr("x", WIDTH / 2)
      .attr("y", 24)
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

export default RadarChart;
