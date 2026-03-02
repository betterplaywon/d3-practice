import { useQuery } from "@tanstack/react-query";
import { chartKeys } from "../api/query-keys";
import { fetchPieChart, PieChartResponse } from "../api/charts";

export function usePieChart() {
  return useQuery<PieChartResponse>({
    queryKey: chartKeys.pie(),
    queryFn: fetchPieChart,
  });
}
