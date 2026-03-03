import ky from "ky";

export interface DonutSlice {
  category: string;
  value: number;
  color: string;
}

export interface DonutChartResponse {
  label: string;
  data: DonutSlice[];
}

export interface PieSlice {
  category: string;
  value: number;
  color: string;
}

export interface PieChartResponse {
  label: string;
  data: PieSlice[];
}

export interface LinePoint {
  date: string;
  value: number;
}

export interface LineSeries {
  name: string;
  color: string;
  points: LinePoint[];
}

export interface LineChartResponse {
  label: string;
  series: LineSeries[];
}

export interface RadarSeries {
  name: string;
  color: string;
  values: number[];
}

export interface RadarChartResponse {
  label: string;
  axes: string[];
  series: RadarSeries[];
}

export interface BoxCategory {
  name: string;
  color: string;
  values: number[];
}

export interface BoxPlotResponse {
  label: string;
  categories: BoxCategory[];
}

export interface StackedBarDatum {
  quarter: string;
  [key: string]: number | string;
}

export interface StackedBarChartResponse {
  label: string;
  keys: string[];
  colors: string[];
  data: StackedBarDatum[];
}

export interface TreeNode {
  name: string;
  value?: number;
  children?: TreeNode[];
}

export interface TreemapResponse {
  label: string;
  name: string;
  children: TreeNode[];
}

export interface HeatCell {
  x: string;
  y: string;
  value: number;
}

export interface HeatmapResponse {
  label: string;
  xLabels: string[];
  yLabels: string[];
  data: HeatCell[];
}

export interface NetworkNode {
  id: string;
  group: number;
  size: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

export interface NetworkGraphResponse {
  label: string;
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export interface StreamDatum {
  month: string;
  [key: string]: number | string;
}

export interface StreamGraphResponse {
  label: string;
  keys: string[];
  colors: string[];
  data: StreamDatum[];
}

const api = ky.create({
  prefixUrl: "/api",
  timeout: 10_000,
});

export const fetchDonutChart = (): Promise<DonutChartResponse> =>
  api.get("charts/donut").json<DonutChartResponse>();

export const fetchPieChart = (): Promise<PieChartResponse> =>
  api.get("charts/pie").json<PieChartResponse>();

export const fetchLineChart = (): Promise<LineChartResponse> =>
  api.get("charts/line").json<LineChartResponse>();

export const fetchRadarChart = (): Promise<RadarChartResponse> =>
  api.get("charts/radar").json<RadarChartResponse>();

export const fetchBoxPlot = (): Promise<BoxPlotResponse> =>
  api.get("charts/box-plot").json<BoxPlotResponse>();

export const fetchStackedBarChart = (): Promise<StackedBarChartResponse> =>
  api.get("charts/stacked-bar").json<StackedBarChartResponse>();

export const fetchTreemap = (): Promise<TreemapResponse> =>
  api.get("charts/treemap").json<TreemapResponse>();

export const fetchHeatmap = (): Promise<HeatmapResponse> =>
  api.get("charts/heatmap").json<HeatmapResponse>();

export const fetchNetworkGraph = (): Promise<NetworkGraphResponse> =>
  api.get("charts/network").json<NetworkGraphResponse>();

export const fetchStreamGraph = (): Promise<StreamGraphResponse> =>
  api.get("charts/stream").json<StreamGraphResponse>();
