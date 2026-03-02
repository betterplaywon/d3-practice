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
