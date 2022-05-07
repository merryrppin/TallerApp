angular.module(aLanguage.appName).controller('homeController', ["$scope", "GeneralService", homeController]);
function homeController($scope, GeneralService) {

    GeneralService.hideGeneralButtons();
    $scope.aLanguage = aLanguage;
    GeneralService.showPanels();//Todo: TEST
}