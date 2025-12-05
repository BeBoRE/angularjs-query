import angular from "angular";
import "./app/app.ts";

angular.element(() => {
  angular.bootstrap(document, ["appModule"]);
});
