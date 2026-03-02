export const chartKeys = {
  all: ["charts"] as const,
  donut: () => [...chartKeys.all, "donut"] as const,
  pie: () => [...chartKeys.all, "pie"] as const,
  line: () => [...chartKeys.all, "line"] as const,
} as const;
