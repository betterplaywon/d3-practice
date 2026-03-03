import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useTreemap } from "../../hooks/use-treemap";
import { TreeNode } from "../../api/charts";

const WIDTH = 800;
const HEIGHT = 560;
const MARGIN = { top: 50, right: 10, bottom: 10, left: 10 };

const Treemap = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useTreemap();

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

    const root = d3
      .hierarchy<TreeNode>(data as TreeNode)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const treemapLayout = d3
      .treemap<TreeNode>()
      .size([graphWidth, graphHeight])
      .paddingOuter(4)
      .paddingInner(2)
      .paddingTop(18);

    treemapLayout(root);

    const colorScale = d3
      .scaleOrdinal(d3.schemeTableau10)
      .domain(data.children.map((d) => d.name));

    // leaf 노드
    const leaf = graph
      .selectAll<SVGGElement, d3.HierarchyRectangularNode<TreeNode>>("g.leaf")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("class", "leaf")
      .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

    leaf
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => colorScale(d.parent?.data.name ?? ""))
      .attr("fill-opacity", 0.75)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    leaf
      .append("text")
      .attr("x", 4)
      .attr("y", 14)
      .attr("font-size", "11px")
      .attr("fill", "#222")
      .text((d) => {
        const w = d.x1 - d.x0;
        return w > 40 ? d.data.name : "";
      });

    leaf
      .append("text")
      .attr("x", 4)
      .attr("y", 26)
      .attr("font-size", "10px")
      .attr("fill", "#555")
      .text((d) => {
        const w = d.x1 - d.x0;
        return w > 50 ? (d.value ?? 0).toLocaleString() : "";
      });

    // 부모 그룹 레이블 (depth=1)
    graph
      .selectAll<SVGTextElement, d3.HierarchyRectangularNode<TreeNode>>("text.parent-label")
      .data(root.descendants().filter((d) => d.depth === 1))
      .enter()
      .append("text")
      .attr("class", "parent-label")
      .attr("x", (d) => d.x0 + 4)
      .attr("y", (d) => d.y0 + 12)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", (d) => colorScale(d.data.name))
      .text((d) => d.data.name);

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

export default Treemap;
