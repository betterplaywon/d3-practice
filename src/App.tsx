import { Routes, Route, Link } from "react-router-dom";
import SvgBasics from "./components/lesson/svg-basics";
import D3DomManipulation from "./components/lesson/d3-dom-manipulation";
import ScatterPlot from "./components/lesson/scatter-plot";
import BarChart from "./components/lesson/bar-chart";
import DonutChart from "./components/lesson/donut-chart";
import PieChart from "./components/lesson/pie-chart";
import LineChart from "./components/lesson/line-chart";
import RadarChart from "./components/lesson/radar-chart";
import BoxPlot from "./components/lesson/box-plot";
import StackedBarChart from "./components/lesson/stacked-bar-chart";
import Treemap from "./components/lesson/treemap";
import Heatmap from "./components/lesson/heatmap";
import NetworkGraph from "./components/lesson/network-graph";
import StreamGraph from "./components/lesson/stream-graph";

export default function App() {
  return (
    <div>
      <nav style={{ padding: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link to="/svg-basics">SVG Basics</Link>
        <Link to="/d3-dom-manipulation">D3 DOM</Link>
        <Link to="/scatter-plot">Scatter Plot</Link>
        <Link to="/bar-chart">Bar Chart</Link>
        <Link to="/donut-chart">Donut Chart</Link>
        <Link to="/pie-chart">Pie Chart</Link>
        <Link to="/line-chart">Line Chart</Link>
        <Link to="/radar-chart">Radar Chart</Link>
        <Link to="/box-plot">Box Plot</Link>
        <Link to="/stacked-bar-chart">Stacked Bar</Link>
        <Link to="/treemap">Treemap</Link>
        <Link to="/heatmap">Heatmap</Link>
        <Link to="/network-graph">Network Graph</Link>
        <Link to="/stream-graph">Stream Graph</Link>
      </nav>
      <Routes>
        <Route path="/" element={<BarChart />} />
        <Route path="/svg-basics" element={<SvgBasics />} />
        <Route path="/d3-dom-manipulation" element={<D3DomManipulation />} />
        <Route path="/scatter-plot" element={<ScatterPlot />} />
        <Route path="/bar-chart" element={<BarChart />} />
        <Route path="/donut-chart" element={<DonutChart />} />
        <Route path="/pie-chart" element={<PieChart />} />
        <Route path="/line-chart" element={<LineChart />} />
        <Route path="/radar-chart" element={<RadarChart />} />
        <Route path="/box-plot" element={<BoxPlot />} />
        <Route path="/stacked-bar-chart" element={<StackedBarChart />} />
        <Route path="/treemap" element={<Treemap />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/network-graph" element={<NetworkGraph />} />
        <Route path="/stream-graph" element={<StreamGraph />} />
      </Routes>
    </div>
  );
}
