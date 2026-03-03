import { useQuery } from "@tanstack/react-query";
import { chartKeys } from "../api/query-keys";
import { fetchStreamGraph, StreamGraphResponse } from "../api/charts";

export function useStreamGraph() {
  return useQuery<StreamGraphResponse>({
    queryKey: chartKeys.stream(),
    queryFn: fetchStreamGraph,
  });
}
