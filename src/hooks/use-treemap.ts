import { useQuery } from "@tanstack/react-query";
import { chartKeys } from "../api/query-keys";
import { fetchTreemap, TreemapResponse } from "../api/charts";

export function useTreemap() {
  return useQuery<TreemapResponse>({
    queryKey: chartKeys.treemap(),
    queryFn: fetchTreemap,
  });
}
