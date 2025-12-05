import angular from "angular";
import "./services/query";
import { queryClientModule } from "./services/queryClient";
import { queryModule } from "./services/query";
import { mutationModule } from "./services/mutation";
import appTemplate from "./app.template.html";
import { postsTabModule } from "./posts/posts.component";
import { addPost, fetchPosts } from "./data/data";

export const app = angular
  .module("appModule", [
    queryClientModule,
    queryModule,
    mutationModule,
    postsTabModule,
  ])
  .component("app", {
    controller: function (query, mutation, $scope, queryClient) {
      $scope.data = {};

      $scope.fetchPosts = fetchPosts;

      const { mutate } = mutation($scope, addPost, {
        onSettled: () => {
          queryClient.invalidateQueries(["posts"]);
        },
        onSuccess: () => {
          $scope.data = {};
        },
      });

      $scope.onSubmit = function () {
        mutate($scope.data);
      };
    },
    templateUrl: appTemplate,
  });
