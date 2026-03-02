import { useQuery } from "@tanstack/react-query";
import { chartKeys } from "../api/query-keys";
import { fetchLineChart, LineChartResponse } from "../api/charts";

export function useLineChart() {
  return useQuery<LineChartResponse>({
    queryKey: chartKeys.line(),
    queryFn: fetchLineChart,
  });
}
