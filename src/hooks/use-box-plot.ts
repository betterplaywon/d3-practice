import { useQuery } from "@tanstack/react-query";
import { chartKeys } from "../api/query-keys";
import { fetchBoxPlot, BoxPlotResponse } from "../api/charts";

export function useBoxPlot() {
  return useQuery<BoxPlotResponse>({
    queryKey: chartKeys.boxPlot(),
    queryFn: fetchBoxPlot,
  });
}
