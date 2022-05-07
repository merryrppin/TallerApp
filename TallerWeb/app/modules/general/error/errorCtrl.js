angular.module(aLanguage.appName).controller('errorController', ["$scope", "GeneralService",  errorController]);
function errorController($scope, GeneralService) {
    $scope.aLanguage = aLanguage;
    GeneralService.hidePanels();//TEST    
}