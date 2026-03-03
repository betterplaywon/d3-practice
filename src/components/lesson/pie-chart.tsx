import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { usePieChart } from "../../hooks/use-pie-chart";
import { PieSlice } from "../../api/charts";

const WIDTH = 600;
const HEIGHT = 500;
const RADIUS = 180;

type ArcDatum = d3.PieArcDatum<PieSlice>;

const PieChart = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = usePieChart();

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = d3.select(canvasRef.current);
    canvas.select("svg").remove();

    const svg = canvas.append("svg").attr("width", WIDTH).attr("height", HEIGHT);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${WIDTH / 2}, ${HEIGHT / 2})`);

    const pie = d3.pie<PieSlice>().value((d) => d.value).sort(null);

    const arc = d3.arc<ArcDatum>().innerRadius(0).outerRadius(RADIUS);

    const labelArc = d3
      .arc<ArcDatum>()
      .innerRadius(RADIUS * 0.65)
      .outerRadius(RADIUS * 0.65);

    const outerArc = d3
      .arc<ArcDatum>()
      .innerRadius(RADIUS * 1.1)
      .outerRadius(RADIUS * 1.1);

    const total = d3.sum(data.data, (d) => d.value);
    const arcs = pie(data.data);

    chart
      .selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // 슬라이스 내부 퍼센트 레이블 (각도가 충분히 큰 경우만)
    chart
      .selectAll<SVGTextElement, ArcDatum>("text.inner-label")
      .data(arcs.filter((d) => d.endAngle - d.startAngle > 0.3))
      .enter()
      .append("text")
      .attr("class", "inner-label")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#fff")
      .attr("font-weight", "bold")
      .text((d) => `${((d.data.value / total) * 100).toFixed(1)}%`);

    // 슬라이스 외부 범주명 레이블
    chart
      .selectAll<SVGTextElement, ArcDatum>("text.outer-label")
      .data(arcs)
      .enter()
      .append("text")
      .attr("class", "outer-label")
      .attr("transform", (d) => {
        const pos = outerArc.centroid(d);
        const midAngle = (d.startAngle + d.endAngle) / 2;
        pos[0] = RADIUS * 1.2 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr("text-anchor", (d) => {
        const midAngle = (d.startAngle + d.endAngle) / 2;
        return midAngle < Math.PI ? "start" : "end";
      })
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .text((d) => d.data.category);

    svg
      .append("text")
      .attr("x", WIDTH / 2)
      .attr("y", 28)
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

export default PieChart;
