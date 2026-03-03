import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useHeatmap } from "../../hooks/use-heatmap";
import { HeatCell } from "../../api/charts";

const WIDTH = 700;
const HEIGHT = 480;
const MARGIN = { top: 50, right: 30, bottom: 60, left: 60 };

const Heatmap = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useHeatmap();

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

    const x = d3
      .scaleBand<string>()
      .domain(data.xLabels)
      .range([0, graphWidth])
      .padding(0.05);

    const y = d3
      .scaleBand<string>()
      .domain(data.yLabels)
      .range([0, graphHeight])
      .padding(0.05);

    const maxVal = d3.max(data.data, (d) => d.value) ?? 0;
    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([0, maxVal]);

    // X축
    graph
      .append("g")
      .attr("transform", `translate(0, ${graphHeight})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain")
      .remove();

    graph.selectAll(".tick text").attr("font-size", "13px").attr("dy", "1.2em");

    // Y축
    graph
      .append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain")
      .remove();

    // 셀 렌더링
    graph
      .selectAll<SVGRectElement, HeatCell>("rect.cell")
      .data(data.data)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", (d) => x(d.x) ?? 0)
      .attr("y", (d) => y(d.y) ?? 0)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.value))
      .attr("rx", 2);

    // 셀 내부 값 레이블
    graph
      .selectAll<SVGTextElement, HeatCell>("text.cell-label")
      .data(data.data)
      .enter()
      .append("text")
      .attr("class", "cell-label")
      .attr("x", (d) => (x(d.x) ?? 0) + x.bandwidth() / 2)
      .attr("y", (d) => (y(d.y) ?? 0) + y.bandwidth() / 2 + 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", (d) => (d.value > maxVal * 0.55 ? "#fff" : "#333"))
      .text((d) => d.value);

    // 컬러 스케일 범례 (하단 그라데이션 바)
    const legendWidth = 200;
    const legendHeight = 12;
    const legendX = graphWidth - legendWidth;
    const legendY = graphHeight + 40;

    const defs = svg.append("defs");
    const gradientId = "heatmap-gradient";
    const gradient = defs
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("x2", "100%");

    d3.range(0, 1.01, 0.1).forEach((t) => {
      gradient
        .append("stop")
        .attr("offset", `${t * 100}%`)
        .attr("stop-color", colorScale(t * maxVal));
    });

    const legendG = graph
      .append("g")
      .attr("transform", `translate(${legendX}, ${legendY})`);

    legendG
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("rx", 2)
      .attr("fill", `url(#${gradientId})`);

    legendG
      .append("text")
      .attr("x", 0)
      .attr("y", legendHeight + 12)
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .text("0");

    legendG
      .append("text")
      .attr("x", legendWidth)
      .attr("y", legendHeight + 12)
      .attr("text-anchor", "end")
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .text(String(maxVal));

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

export default Heatmap;
