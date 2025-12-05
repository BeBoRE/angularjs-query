import {
  QueryClient,
  MutationObserver,
  MutationOptions,
  MutationFunction,
} from "@tanstack/query-core";
import angular, { IRootScopeService, IScope } from "angular";
import { queryClientModule } from "./queryClient";

export const mutationModule = angular
  .module("mutationModule", [queryClientModule])
  .factory(
    "mutation",
    function ($rootScope: IRootScopeService, queryClient: QueryClient) {
      return function (
        scope: IScope,
        mutationFn: MutationFunction,
        mutationOptions: Omit<MutationOptions, "mutationFn">
      ) {
        const observer = new MutationObserver(queryClient, {
          mutationFn,
          ...mutationOptions,
        });
        const result = observer.getCurrentResult();
        const unsub = observer.subscribe((r) => {
          Object.assign(result, r);
          $rootScope.$applyAsync();
        });

        $rootScope.$destroy = () => {
          unsub();
        };

        scope.$on("$destory", () => {
          unsub();
        });

        observer.subscribe((r) => {
          Object.assign(result, r);
          $rootScope.$applyAsync();
        });

        return result;
      };
    }
  ).name;
