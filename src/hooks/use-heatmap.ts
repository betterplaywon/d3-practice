import { useQuery } from "@tanstack/react-query";
import { chartKeys } from "../api/query-keys";
import { fetchHeatmap, HeatmapResponse } from "../api/charts";

export function useHeatmap() {
  return useQuery<HeatmapResponse>({
    queryKey: chartKeys.heatmap(),
    queryFn: fetchHeatmap,
  });
}
