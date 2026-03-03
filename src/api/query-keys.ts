export const chartKeys = {
  all: ["charts"] as const,
  donut: () => [...chartKeys.all, "donut"] as const,
  pie: () => [...chartKeys.all, "pie"] as const,
  line: () => [...chartKeys.all, "line"] as const,
  radar: () => [...chartKeys.all, "radar"] as const,
  boxPlot: () => [...chartKeys.all, "boxPlot"] as const,
  stackedBar: () => [...chartKeys.all, "stackedBar"] as const,
  treemap: () => [...chartKeys.all, "treemap"] as const,
  heatmap: () => [...chartKeys.all, "heatmap"] as const,
  network: () => [...chartKeys.all, "network"] as const,
  stream: () => [...chartKeys.all, "stream"] as const,
} as const;
