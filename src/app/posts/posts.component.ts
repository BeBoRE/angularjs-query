import angular, { IController, IScope } from "angular";
import postsTemplate from "./posts.template.html";
import { fetchPosts } from "../data/data";
import { QueryService, queryModule } from "../services/query";
import { mutationModule } from "../services/mutation";
import { queryClientModule } from "../services/queryClient";

export const postsTabModule = angular
  .module("postModule", [queryModule, mutationModule, queryClientModule])
  .component("postsTab", {
    controllerAs: "vm",
    templateUrl: postsTemplate,
    controller: function ($scope: IScope, query: QueryService) {
      const vm = this as IController;
      $scope.fetchPosts = fetchPosts;

      vm.posts = query($scope, ["posts"], fetchPosts);
    },
  }).name;
