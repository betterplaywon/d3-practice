import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useNetworkGraph } from "../../hooks/use-network-graph";
import { NetworkNode, NetworkLink } from "../../api/charts";

const WIDTH = 800;
const HEIGHT = 600;
const MARGIN = { top: 40, right: 20, bottom: 20, left: 20 };

type SimNode = d3.SimulationNodeDatum & NetworkNode;
type SimLink = d3.SimulationLinkDatum<SimNode> & { value: number };

const NetworkGraph = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useNetworkGraph();

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

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    // 시뮬레이션이 노드를 직접 변경하므로 복사본 사용
    const nodes: SimNode[] = data.nodes.map((n) => ({ ...n }));
    const links: SimLink[] = data.links.map((l) => ({
      source: l.source,
      target: l.target,
      value: l.value,
    }));

    // 링크 선
    const linkSel = graph
      .append("g")
      .selectAll<SVGLineElement, SimLink>("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#bbb")
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 1.5)
      .attr("stroke-opacity", 0.6);

    // 노드 원
    const nodeSel = graph
      .append("g")
      .selectAll<SVGCircleElement, SimNode>("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => colorScale(String(d.group)))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "grab");

    // 노드 레이블
    const labelSel = graph
      .append("g")
      .selectAll<SVGTextElement, SimNode>("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("font-size", "11px")
      .attr("fill", "#333")
      .attr("dx", (d) => d.size + 4)
      .attr("dy", "0.35em")
      .text((d) => d.id);

    // Force simulation
    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2))
      .force(
        "collision",
        d3.forceCollide<SimNode>().radius((d) => d.size + 5),
      );

    simulation.on("tick", () => {
      linkSel
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);

      nodeSel.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);

      labelSel.attr("x", (d) => d.x ?? 0).attr("y", (d) => d.y ?? 0);
    });

    // 드래그 인터랙션
    const drag = d3
      .drag<SVGCircleElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeSel.call(drag);

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
      simulation.stop();
      canvas.select("svg").remove();
    };
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading chart data</div>;

  return <div ref={canvasRef} />;
};

export default NetworkGraph;
