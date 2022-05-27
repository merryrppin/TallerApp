angular.module(aLanguage.appName).controller('loginController', ["$scope", "$rootScope", "GeneralService", "SessionService", loginController]);
function loginController($scope, $rootScope, GeneralService, SessionService) {
    $scope.aLanguage = aLanguage;
    // GeneralService.hidePanels();//Todo: TEST

    $scope.loading = false;

    $scope.LoginEntity = {
        login: '',
        password: '',
        rememberLogin: false
    }

    var rememberLoginState = Cookies.get("rememberLogin");
    if (typeof rememberLoginState !== 'undefined') {
        try {
            var rememberLoginStateDecoded = JSON.parse(rememberLoginState);
            $scope.LoginEntity.rememberLogin = rememberLoginStateDecoded.rememberLogin;
            $scope.LoginEntity.login = rememberLoginStateDecoded.login;
            $scope.LoginEntity.password = rememberLoginStateDecoded.password;
        } catch { }
    }

    $scope.loginUser = function () {
        if ($("#frmLogin").valid()) {
            $scope.loading = true;
            GeneralService.executeAjax({
                url: 'api/login',
                data: $scope.LoginEntity,
                success: function (response) {
                    if (typeof response !== 'undefined' && typeof response.UserId !== 'undefined' && response.UserId !== 0) {
                        if ($scope.LoginEntity.rememberLogin) {
                            Cookies.set("rememberLogin", JSON.stringify($scope.LoginEntity), { expires: 15 });
                        }
                        $rootScope.$broadcast('clearState');
                        SessionService.model = angular.copy(response);
                        $rootScope.$broadcast('savestate');
                        $rootScope.$broadcast('restorestate');
                        window.location.hash = "#!/home";
                        window.location.pathname = "General.html";
                    } else {
                        GeneralService.showToastR({
                            body: 'Usuario o contraseña incorrecta',
                            type: 'error'
                        });
                        $scope.loading = false;
                    }
                },
                funcionIncorrecto: function () { $scope.loading = false; }
            });

        }
    };


    $(document).ready(function () {
        $("#frmLogin").validate({
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }
            }
        });
    });
}