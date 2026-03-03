import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useStreamGraph } from "../../hooks/use-stream-graph";
import { StreamDatum } from "../../api/charts";

const WIDTH = 800;
const HEIGHT = 500;
const MARGIN = { top: 50, right: 30, bottom: 60, left: 50 };

const StreamGraph = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useStreamGraph();

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

    const stack = d3
      .stack<StreamDatum>()
      .keys(data.keys)
      .offset(d3.stackOffsetWiggle)
      .order(d3.stackOrderInsideOut);

    const stackedData = stack(data.data as never);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(data.keys)
      .range(data.colors);

    const x = d3
      .scaleLinear()
      .domain([0, data.data.length - 1])
      .range([0, graphWidth]);

    const allY = stackedData.flatMap((layer) => layer.flatMap((d) => [d[0], d[1]]));
    const y = d3
      .scaleLinear()
      .domain([d3.min(allY) ?? 0, d3.max(allY) ?? 0])
      .range([graphHeight, 0]);

    const area = d3
      .area<d3.SeriesPoint<StreamDatum>>()
      .x((_, i) => x(i))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);

    graph
      .selectAll<SVGPathElement, d3.Series<StreamDatum, string>>("path")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("d", area)
      .attr("fill", (d) => colorScale(d.key))
      .attr("fill-opacity", 0.85)
      .attr("stroke", "none");

    // X축 (월 레이블)
    const xBand = d3
      .scaleBand<string>()
      .domain(data.data.map((d) => d.month as string))
      .range([0, graphWidth]);

    graph
      .append("g")
      .attr("transform", `translate(0, ${graphHeight})`)
      .call(d3.axisBottom(xBand).tickSize(0))
      .select(".domain")
      .remove();

    graph.selectAll(".tick text").attr("font-size", "12px").attr("dy", "1.2em");

    // 범례
    const legendGroup = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${HEIGHT - MARGIN.bottom + 32})`);

    data.keys.forEach((key, i) => {
      const g = legendGroup.append("g").attr("transform", `translate(${i * 90}, 0)`);
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

export default StreamGraph;
