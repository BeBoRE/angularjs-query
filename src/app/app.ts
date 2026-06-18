import angular from "angular";
import "./services/query";
import { queryClientModule } from "./services/queryClient";
import mutationModule, { MutationService } from "./services/mutation";
import appTemplate from "./app.template.html";
import { postsTabModule } from "./posts/posts.component";
import { Post, addPost, fetchPosts } from "./data/data";
import { QueryClient } from "@tanstack/query-core";

export const app = angular
  .module("appModule", [queryClientModule, mutationModule, postsTabModule])
  .component("app", {
    controller: function (
      useMutation: MutationService,
      $scope,
      queryClient: QueryClient
    ) {
      $scope.data = {};

      $scope.fetchPosts = fetchPosts;

      $scope.addPost = useMutation($scope, {
        mutationFn: (data: Post) => addPost(data),
        onSettled: () => {
          queryClient.cancelQueries({ queryKey: ["posts"] });
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onSuccess: () => {
          $scope.data = {};
        },
      });
    },
    templateUrl: appTemplate,
  });
