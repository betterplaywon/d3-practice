import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useLineChart } from "../../hooks/use-line-chart";
import { LinePoint } from "../../api/charts";

const WIDTH = 700;
const HEIGHT = 500;
const MARGIN = { top: 50, right: 160, bottom: 60, left: 60 };

interface ParsedPoint extends LinePoint {
  parsedDate: Date;
}

const Lesson07 = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useLineChart();

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

    const parseDate = d3.timeParse("%Y-%m-%d");

    const allPoints = data.series.flatMap((s) =>
      s.points.map((p) => ({ date: parseDate(p.date)!, value: p.value })),
    );

    const xExtent = d3.extent(allPoints, (d) => d.date) as [Date, Date];
    const xScale = d3.scaleTime().domain(xExtent).range([0, graphWidth]);

    const yMax = d3.max(allPoints, (d) => d.value) ?? 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax * 1.1])
      .range([graphHeight, 0]);

    // X축
    graph
      .append("g")
      .attr("transform", `translate(0, ${graphHeight})`)
      .call(
        d3
          .axisBottom<Date>(xScale)
          .ticks(d3.timeMonth.every(1))
          .tickFormat(d3.timeFormat("%m월") as (d: Date | d3.NumberValue) => string),
      )
      .selectAll("text")
      .attr("font-size", "12px");

    // Y축
    graph
      .append("g")
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll("text")
      .attr("font-size", "12px");

    // 수평 그리드 라인
    const gridGroup = graph
      .append("g")
      .call(
        d3.axisLeft(yScale).ticks(5).tickSize(-graphWidth).tickFormat(() => ""),
      );
    gridGroup.selectAll("line").attr("stroke", "#e0e0e0").attr("stroke-dasharray", "3,3");
    gridGroup.select(".domain").remove();

    // Line generator
    const line = d3
      .line<ParsedPoint>()
      .x((d) => xScale(d.parsedDate))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // 각 시리즈 렌더링
    data.series.forEach((series) => {
      const parsedPoints: ParsedPoint[] = series.points.map((p) => ({
        ...p,
        parsedDate: parseDate(p.date)!,
      }));

      graph
        .append("path")
        .datum(parsedPoints)
        .attr("fill", "none")
        .attr("stroke", series.color)
        .attr("stroke-width", 2.5)
        .attr("d", line);

      graph
        .selectAll(`.dot-${series.name}`)
        .data(parsedPoints)
        .enter()
        .append("circle")
        .attr("class", `dot-${series.name}`)
        .attr("cx", (d) => xScale(d.parsedDate))
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 4)
        .attr("fill", series.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);
    });

    // 범례 (우측)
    const legend = svg
      .append("g")
      .attr("transform", `translate(${WIDTH - MARGIN.right + 20}, ${MARGIN.top})`);

    data.series.forEach((series, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 24})`);
      row
        .append("line")
        .attr("x1", 0)
        .attr("y1", 7)
        .attr("x2", 20)
        .attr("y2", 7)
        .attr("stroke", series.color)
        .attr("stroke-width", 2.5);
      row.append("circle").attr("cx", 10).attr("cy", 7).attr("r", 4).attr("fill", series.color);
      row
        .append("text")
        .attr("x", 28)
        .attr("y", 12)
        .attr("font-size", "13px")
        .attr("fill", "#333")
        .text(series.name);
    });

    // 제목
    svg
      .append("text")
      .attr("x", WIDTH / 2)
      .attr("y", MARGIN.top - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text(data.label);

    // Y축 레이블
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(HEIGHT / 2))
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#666")
      .text("판매량");

    return () => {
      canvas.select("svg").remove();
    };
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading chart data</div>;

  return <div ref={canvasRef} />;
};

export default Lesson07;
