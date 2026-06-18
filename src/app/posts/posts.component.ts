import angular, { IController, IScope, ITimeoutService } from "angular";
import postsTemplate from "./posts.template.html";
import { fetchPosts } from "../data/data";
import { queryClientModule } from "../services/queryClient";
import { keepPreviousData } from "@tanstack/query-core";
import infiniteQueryModule, { InfiniteQuery } from "../services/infiniteQuery";

export const postsTabModule = angular
  .module("postModule", [infiniteQueryModule, queryClientModule])
  .component("postsTab", {
    controllerAs: "vm",
    templateUrl: postsTemplate,
    controller: function (
      $scope: IScope,
      infiniteQuery: InfiniteQuery,
      $timeout: ITimeoutService
    ) {
      const vm = this as IController;

      const posts = infiniteQuery($scope, () => ({
        queryKey: ["posts", vm.searchInput],
        queryFn: ({ pageParam }) => fetchPosts(vm.searchInput, pageParam),
        placeholderData: keepPreviousData,
        initialPageParam: 1,
        getNextPageParam: (lastPage, _pages, lastPageParam) =>
          lastPage.length ? lastPageParam + 1 : undefined,
        select: (data) => data.pages.flat(),
        staleTime: 1000 * 60 * 10,
      }));

      $timeout(() => {
        vm.startLoading = true;
      }, 1000 * 1);

      vm.posts = posts;
    },
  }).name;
