import {
  QueryObserverOptions,
  QueryObserverResult,
  useQuery,
} from "@tanstack/react-query";
import { Expand } from "./types";
import { ObjectSet, Osdk } from "@osdk/client";
import { ObjectOrInterfaceDefinition } from "@osdk/api/build/esm/ontology/ObjectOrInterface";

export function useObject<O extends ObjectOrInterfaceDefinition>(
  objectSet: ObjectSet<O>
): Expand<QueryObserverResult<Osdk.Instance<O>, Error>> {
  return useQuery<Osdk.Instance<O>, Error>({
    queryKey: [objectSet, "fetchPage", 1],
    queryFn: () =>
      objectSet.fetchPage({ $pageSize: 1 }).then((result) => result.data[0]),
  });
}

export type ArrayInstance<O extends ObjectOrInterfaceDefinition> = Array<
  Osdk.Instance<O>
>;
