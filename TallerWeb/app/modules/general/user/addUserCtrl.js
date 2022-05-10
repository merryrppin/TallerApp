angular.module(aLanguage.appName).controller('addUserController', ["$scope", '$rootScope', "$location", "GeneralService", addUserController]);
function addUserController($scope, $rootScope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();
    $rootScope.showSaveButton = true;
    $rootScope.showCancelButton = true;
    $scope.aLanguage = aLanguage;
    $scope.userIdSelected = typeof GeneralService.userId !== 'undefined' ? GeneralService.userId : -1;

    $scope.currentUser = { UserId: $scope.userIdSelected };

    $scope.loadUser = function () {
        var dataSP = {
            "StoredProcedureName": "GetUser",
            "StoredParams": [{
                Name: "UserId",
                Value: $scope.userIdSelected
            }]
        };

        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Value.length === 1) {
                    $scope.currentUser = response.Value[0].DataMapped[0];
                } else {
                    GeneralService.showToastR({
                        body: aLanguage[response.GeneralError],
                        type: 'error'
                    });
                }
            }
        });
    };

    if ($scope.userIdSelected !== -1) {
        $scope.loadUser();
    }

    $scope.saveUser = function () {
        var dataSP = {
            "StoredProcedureName": "SaveUser",
            "StoredParams": [{
                Name: "jsonUser",
                Value: JSON.stringify($scope.currentUser)
            }]
        };

        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Value.length === 0) {
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


    $scope.encryptPassword = function (strPassword) {
        $scope.loading = true;
        GeneralService.executeAjax({
            url: 'api/encryptstring',
            data: {
                password: strPassword
            },
            success: function (response) {
                $scope.currentUser.PasswordEncrypt = response;
                $scope.saveUser();
            }
        });
    };


    $rootScope.saveBtnFunction = function () {
        if ($("#frmUser").valid()) {
            $scope.encryptPassword($scope.currentUser.Password);
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
                    required: true,
                    minlength: 6
                },
                password2: {
                    required: true,
                    equalTo: "#password1"
                }
            }
        });
    });
}