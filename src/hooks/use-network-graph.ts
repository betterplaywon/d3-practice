import { useQuery } from "@tanstack/react-query";
import { chartKeys } from "../api/query-keys";
import { fetchNetworkGraph, NetworkGraphResponse } from "../api/charts";

export function useNetworkGraph() {
  return useQuery<NetworkGraphResponse>({
    queryKey: chartKeys.network(),
    queryFn: fetchNetworkGraph,
  });
}
