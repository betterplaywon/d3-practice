import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useBoxPlot } from "../../hooks/use-box-plot";

const WIDTH = 700;
const HEIGHT = 500;
const MARGIN = { top: 50, right: 30, bottom: 60, left: 60 };

const BoxPlot = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useBoxPlot();

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

    // 통계 계산
    interface BoxStats {
      name: string;
      color: string;
      q1: number;
      median: number;
      q3: number;
      whiskerLow: number;
      whiskerHigh: number;
      outliers: number[];
    }

    const stats: BoxStats[] = data.categories.map((cat) => {
      const sorted = [...cat.values].sort(d3.ascending);
      const q1 = d3.quantile(sorted, 0.25) ?? 0;
      const median = d3.quantile(sorted, 0.5) ?? 0;
      const q3 = d3.quantile(sorted, 0.75) ?? 0;
      const iqr = q3 - q1;
      const whiskerLow = Math.max(d3.min(sorted) ?? 0, q1 - 1.5 * iqr);
      const whiskerHigh = Math.min(d3.max(sorted) ?? 0, q3 + 1.5 * iqr);
      const outliers = sorted.filter((v) => v < whiskerLow || v > whiskerHigh);
      return { name: cat.name, color: cat.color, q1, median, q3, whiskerLow, whiskerHigh, outliers };
    });

    const allValues = data.categories.flatMap((c) => c.values);
    const minAll = d3.min(allValues) ?? 0;
    const maxAll = d3.max(allValues) ?? 0;
    const padding = (maxAll - minAll) * 0.1;

    const x = d3
      .scaleBand<string>()
      .domain(stats.map((s) => s.name))
      .range([0, graphWidth])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([minAll - padding, maxAll + padding])
      .range([graphHeight, 0]);

    // X축
    graph
      .append("g")
      .attr("transform", `translate(0, ${graphHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("font-size", "13px");

    // Y축
    graph
      .append("g")
      .call(d3.axisLeft(y).ticks(6))
      .selectAll("text")
      .attr("font-size", "12px");

    // 수평 그리드
    const gridGroup = graph
      .append("g")
      .call(d3.axisLeft(y).ticks(6).tickSize(-graphWidth).tickFormat(() => ""));
    gridGroup.selectAll("line").attr("stroke", "#e0e0e0").attr("stroke-dasharray", "3,3");
    gridGroup.select(".domain").remove();

    const boxWidth = x.bandwidth();

    stats.forEach((s) => {
      const xPos = x(s.name) ?? 0;
      const cx = xPos + boxWidth / 2;

      // whisker 수직선
      graph
        .append("line")
        .attr("x1", cx)
        .attr("x2", cx)
        .attr("y1", y(s.whiskerHigh))
        .attr("y2", y(s.whiskerLow))
        .attr("stroke", s.color)
        .attr("stroke-width", 1.5);

      // IQR 박스
      graph
        .append("rect")
        .attr("x", xPos)
        .attr("y", y(s.q3))
        .attr("width", boxWidth)
        .attr("height", y(s.q1) - y(s.q3))
        .attr("fill", s.color)
        .attr("fill-opacity", 0.3)
        .attr("stroke", s.color)
        .attr("stroke-width", 1.5);

      // 중앙값 선
      graph
        .append("line")
        .attr("x1", xPos)
        .attr("x2", xPos + boxWidth)
        .attr("y1", y(s.median))
        .attr("y2", y(s.median))
        .attr("stroke", s.color)
        .attr("stroke-width", 2.5);

      // whisker cap (수평 틱)
      [s.whiskerLow, s.whiskerHigh].forEach((val) => {
        graph
          .append("line")
          .attr("x1", cx - boxWidth / 4)
          .attr("x2", cx + boxWidth / 4)
          .attr("y1", y(val))
          .attr("y2", y(val))
          .attr("stroke", s.color)
          .attr("stroke-width", 1.5);
      });

      // 이상치
      s.outliers.forEach((val) => {
        graph
          .append("circle")
          .attr("cx", cx)
          .attr("cy", y(val))
          .attr("r", 3.5)
          .attr("fill", "none")
          .attr("stroke", s.color)
          .attr("stroke-width", 1.5);
      });
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

export default BoxPlot;
