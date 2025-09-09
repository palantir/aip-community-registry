import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      /**
       * Because the OSDK objects are proxies which can't be copied, this makes updates hard because
       * we can't create new objects. Here is the info about structuralSharing from the docs:
       *
       * React Query uses a technique called "structural sharing" to ensure that as many references
       * as possible will be kept intact between re-renders. If data is fetched over the network,
       * usually, you'll get a completely new reference by json parsing the response. However, React
       * Query will keep the original reference if nothing changed in the data. If a subset changed,
       * React Query will keep the unchanged parts and only replace the changed parts.
       * */
      structuralSharing: false,
    },
  },
});
