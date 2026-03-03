import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDonutChart } from "../../hooks/use-donut-chart";
import { DonutSlice } from "../../api/charts";

const WIDTH = 600;
const HEIGHT = 500;
const RADIUS = 180;
const INNER_RADIUS = 80;

type ArcDatum = d3.PieArcDatum<DonutSlice>;

const DonutChart = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useDonutChart();

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = d3.select(canvasRef.current);
    canvas.select("svg").remove();

    const svg = canvas.append("svg").attr("width", WIDTH).attr("height", HEIGHT);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${WIDTH / 2 - 80}, ${HEIGHT / 2})`);

    const pie = d3.pie<DonutSlice>().value((d) => d.value).sort(null);

    const arc = d3.arc<ArcDatum>().innerRadius(INNER_RADIUS).outerRadius(RADIUS);
    const arcHover = d3
      .arc<ArcDatum>()
      .innerRadius(INNER_RADIUS)
      .outerRadius(RADIUS + 10);

    const arcs = pie(data.data);

    chart
      .selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).transition().duration(200).attr("d", arcHover as never);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("d", arc as never);
      });

    const total = d3.sum(data.data, (d) => d.value);
    chart
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.3em")
      .attr("font-size", "14px")
      .attr("fill", "#666")
      .text("총계");
    chart
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text(total.toLocaleString());

    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${WIDTH / 2 + 120}, ${HEIGHT / 2 - (data.data.length * 25) / 2})`,
      );

    data.data.forEach((d, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 25})`);
      row.append("rect").attr("width", 14).attr("height", 14).attr("rx", 2).attr("fill", d.color);
      row
        .append("text")
        .attr("x", 20)
        .attr("y", 11)
        .attr("font-size", "13px")
        .attr("fill", "#333")
        .text(d.category);
    });

    svg
      .append("text")
      .attr("x", WIDTH / 2 - 80)
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

export default DonutChart;
