import { useQuery } from "@tanstack/react-query";
import { chartKeys } from "../api/query-keys";
import { fetchStackedBarChart, StackedBarChartResponse } from "../api/charts";

export function useStackedBarChart() {
  return useQuery<StackedBarChartResponse>({
    queryKey: chartKeys.stackedBar(),
    queryFn: fetchStackedBarChart,
  });
}
