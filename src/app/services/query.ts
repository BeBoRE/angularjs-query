import {
  QueryClient,
  QueryObserver,
  QueryKey,
  QueryFunction,
} from "@tanstack/query-core";
import angular, { IRootScopeService, IScope } from "angular";
import { queryClientModule } from "./queryClient";
import NgAnimate from "angular-animate";

export type QueryService = ReturnType<typeof queryFactory>;

export function queryFactory(
  $rootScope: IRootScopeService,
  queryClient: QueryClient
) {
  return function (scope: IScope, queryKey: QueryKey, queryFn: QueryFunction) {
    const observer = new QueryObserver(queryClient, {
      queryKey,
      queryFn,
    });

    const result = observer.getCurrentResult();
    const unsub = observer.subscribe((r) => {
      Object.assign(result, r);
      scope.$applyAsync();
    });

    $rootScope.$destroy = () => {
      unsub();
    };

    scope.$on("$destroy", () => {
      unsub();
    });

    return observer.trackResult(result);
  };
}

export const queryModule = angular
  .module("query", [queryClientModule, NgAnimate])
  .factory("query", queryFactory)
  .directive("query", [
    "$animate",
    function ($animate: angular.animate.IAnimateService, query: QueryService) {
      return {
        restrict: "E",
        scope: false,
        transclude: {
          pending: "queryPending",
          success: "querySuccess",
          error: "queryError",
        },
        link: function (scope: IScope, element, attrs, _ctrl, transclude) {
          const fetcher = scope.$eval(attrs.fetcher);
          const dataQuery = query(scope, ["posts"], fetcher);

          const anchor = document.createComment("query-anchor");
          element.replaceWith(anchor);

          let current = null; // Track current clone and scope

          function clearCurrent() {
            if (current) {
              $animate.leave(current.clone);
              current.scope.$destroy();
              current = null;
            }
          }

          function renderSuccess(result) {
            clearCurrent();
            if (transclude?.isSlotFilled("success")) {
              const childScope = scope.$new(false, scope);
              childScope[attrs.data] = result;

              transclude(
                childScope,
                function (clone) {
                  current = { clone, scope: childScope };
                  $animate.enter(clone, anchor.parentNode, anchor);
                },
                anchor.parentNode,
                "success"
              );
              scope.$applyAsync();
            }
          }

          function renderPending() {
            clearCurrent();
            if (transclude?.isSlotFilled("pending")) {
              const childScope = scope.$new(false, scope);

              transclude(
                childScope,
                function (clone) {
                  current = { clone, scope: childScope };
                  $animate.enter(clone, anchor.parentNode, anchor);
                },
                anchor.parentNode,
                "pending"
              );
              scope.$applyAsync();
            }
          }

          function renderError() {
            clearCurrent();
            if (transclude?.isSlotFilled("error")) {
              const childScope = scope.$new(false, scope);
              childScope.$error = transclude(
                childScope,
                function (clone) {
                  current = { clone, scope: childScope };
                  $animate.enter(clone, anchor.parentNode, anchor);
                },
                anchor.parentNode,
                "error"
              );
            }
          }

          // Clean up on destroy
          scope.$on("$destroy", () => {
            clearCurrent();
          });
        },
      };
    },
  ]).name;
