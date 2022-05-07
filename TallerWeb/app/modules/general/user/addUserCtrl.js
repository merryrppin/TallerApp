angular.module(aLanguage.appName).controller('addUserController', ["$scope", '$rootScope', "$location", "GeneralService", addUserController]);
function addUserController($scope, $rootScope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();
    $rootScope.showSaveButton = true;
    $rootScope.showCancelButton = true;
    $scope.aLanguage = aLanguage;
    $scope.userIdSelected = typeof GeneralService.userId !== 'undefined' ? GeneralService.userId : -1;

    $scope.currentUser = { UserId: $scope.userIdSelected };

    $scope.loadUser = function () {
    };

    $scope.saveUser = function () {
        var apiMethod = $scope.userIdSelected === -1 ? 'addUser' : 'updateUser';
        GeneralService.executeAjax({
            url: 'api/' + apiMethod,
            data: $scope.currentUser,
            success: function (response) {
                if (response.BooleanResponse) {
                    GeneralService.showToastR({
                        body: aLanguage.saveSuccessful,
                        type: 'success'
                    });
                    $scope.currentUser = {};
                } else {
                    GeneralService.showToastR({
                        body: aLanguage[response.GeneralError],
                        type: 'error'
                    });
                }
            }
        });
    };
    $rootScope.saveBtnFunction = function () {
        if ($("#frmUser").valid()) {
            $scope.saveUser();
        }
    }

    $scope.returnToList = function () {
        $location.path('/listUsers');
    };

    angular.element(document).ready(init);

    function init() {
        if ($scope.userIdSelected !== -1)
            $scope.loadUser();
    }

    $(document).ready(function () {
        $("#frmUser").validate({
            rules: {
                userFirstName: {
                    required: true
                },
                userLastName: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                login: {
                    required: true
                },
                password1: {
                    required: true
                },
                password2: {
                    required: true,
                    equalTo: "#password1"
                }
            }
        });
    });
}