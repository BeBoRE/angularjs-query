import { QueryClient } from "@tanstack/query-core";
import angular from "angular";

export const queryClientModule = angular
  .module("queryClient", [])
  .value("queryClient", new QueryClient()).name;
