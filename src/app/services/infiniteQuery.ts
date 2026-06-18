import {
  DefaultError,
  InfiniteQueryObserver,
  InfiniteQueryObserverOptions,
  QueryClient,
  QueryKey,
} from "@tanstack/query-core";
import angular, { IScope } from "angular";
import { queryClientModule } from "./queryClient";

export type InfiniteQuery = ReturnType<typeof infiniteQueryFactory>;

infiniteQueryFactory.$inject = ["queryClient"];
function infiniteQueryFactory(queryClient: QueryClient) {
  return function <
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown
  >(
    scope: IScope,
    optionsGetter: () => InfiniteQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >
  ) {
    const initialOptions = optionsGetter();

    const observer = new InfiniteQueryObserver(queryClient, initialOptions);
    const result = observer.getCurrentResult();

    let isObserved = false;
    const startQuery = () => {
      if (isObserved) return;
      isObserved = true;

      scope.$watch(
        () => optionsGetter(),
        (newKey, oldKey) => {
          if (newKey !== oldKey) {
            observer.setOptions(newKey);
          }
        },
        true
      );

      const unsub = observer.subscribe((r) => {
        console.log(r);
        Object.assign(result, r);
        scope.$applyAsync();
      });

      scope.$on("$destroy", () => {
        unsub();
      });
    };

    return new Proxy(result, {
      get(_target, prop, receiver) {
        // 1. Kick off the subscription on the very first read
        startQuery();

        // 2. Pass the read through TanStack Query's tracker for optimizations
        const tracked = observer.trackResult(result);

        // 3. Return the requested property natively
        return Reflect.get(tracked, prop, receiver);
      },
    });
  };
}

const infiniteQueryModule = "infiniteQuery";
angular
  .module(infiniteQueryModule, [queryClientModule])
  .factory("infiniteQuery", infiniteQueryFactory);

export default infiniteQueryModule;
