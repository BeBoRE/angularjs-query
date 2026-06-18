import {
  QueryClient,
  MutationObserver,
  MutationObserverOptions,
  MutationObserverResult,
  DefaultError,
} from "@tanstack/query-core";
import angular, { IScope } from "angular";
import { queryClientModule } from "./queryClient";

export type MutationService = ReturnType<typeof mutationFactory>;

mutationFactory.$inject = ["queryClient"];
function mutationFactory(queryClient: QueryClient) {
  return function useMutation<
    TData = unknown,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown
  >(
    scope: IScope,
    options: MutationObserverOptions<TData, TError, TVariables, TContext>
  ): MutationObserverResult<TData, TError, TVariables, TContext> {
    const observer = new MutationObserver(queryClient, options);

    const result = observer.getCurrentResult();

    const unsub = observer.subscribe((r) => {
      Object.assign(result, r);
      scope.$applyAsync();
    });

    scope.$on("$destroy", () => {
      unsub();
    });

    return result as MutationObserverResult<
      TData,
      TError,
      TVariables,
      TContext
    >;
  };
}

const mutationModule = "mutationModule";
export default mutationModule;

angular
  .module(mutationModule, [queryClientModule])
  .factory("useMutation", mutationFactory);
