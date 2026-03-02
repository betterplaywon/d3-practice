import { useQuery } from "@tanstack/react-query";
import { chartKeys } from "../api/query-keys";
import { fetchDonutChart, DonutChartResponse } from "../api/charts";

export function useDonutChart() {
  return useQuery<DonutChartResponse>({
    queryKey: chartKeys.donut(),
    queryFn: fetchDonutChart,
  });
}
