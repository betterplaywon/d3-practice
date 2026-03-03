import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Planet {
  distance: number;
  radius: number;
  fill: string;
}

const ScatterPlot = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = d3.select(canvasRef.current);

    canvas.select("svg").remove();

    const svg = canvas.append("svg").attr("width", 600).attr("height", 600);

    fetch("/planets.json")
      .then((response) => response.json())
      .then((data: Planet[]) => {
        const circles = svg.selectAll("circle").data(data);

        // add attrs to rects already in the DOM
        circles
          .attr("cy", 200)
          .attr("cx", (d) => d.distance)
          .attr("r", (d) => d.radius)
          .attr("fill", (d) => d.fill);

        // append the enter selection to the DOM
        circles
          .enter()
          .append("circle")
          .attr("cy", 200)
          .attr("cx", (d) => d.distance)
          .attr("r", (d) => d.radius)
          .attr("fill", (d) => d.fill);
      });

    return () => {
      canvas.select("svg").remove();
    };
  }, []);

  return <div ref={canvasRef}></div>;
};

export default ScatterPlot;
