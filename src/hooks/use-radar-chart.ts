import { useQuery } from "@tanstack/react-query";
import { chartKeys } from "../api/query-keys";
import { fetchRadarChart, RadarChartResponse } from "../api/charts";

export function useRadarChart() {
  return useQuery<RadarChartResponse>({
    queryKey: chartKeys.radar(),
    queryFn: fetchRadarChart,
  });
}
