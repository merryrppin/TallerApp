angular.module(aLanguage.appName).controller('generalController', ["$scope", '$rootScope', "$timeout", "$filter", "$location", "SessionService", "GeneralService", generalController]);
function generalController($scope, $rootScope, $timeout, $filter, $location, SessionService, GeneralService) {
    var ctrl = this;
    ctrl.selectedLanguage = GeneralService.selectedLanguage;
    ctrl.aLanguage = aLanguage;
    ctrl.allLevels = [];
    ctrl.menusByLevel = [];
    ctrl.menus = [];
    ctrl.allMenus = [];
    ctrl.currentMenuIdByLevel = [];
    ctrl.currentUrl = "-";
    
    ctrl.showNewButton = $rootScope.showNewButton;
    ctrl.showSaveButton = $rootScope.showSaveButton;
    ctrl.showClearButton = $rootScope.showClearButton;
    ctrl.showCancelButton = $rootScope.showCancelButton;
    ctrl.showPrintButton = $rootScope.showPrintButton;
    
    $rootScope.$broadcast('restorestate');
    GeneralService.userLogin = SessionService.model;
    ctrl.userLogin = GeneralService.userLogin;

    ctrl.autentication = GeneralService.autentication;//false por defecto

    $scope.$watch(GeneralService.autentication, function (change) { ///adding watcher on someService.getChange, it will fire when change changes value
        ctrl.autentication = GeneralService.autentication; //setting change to controller here you can put some extra logic
    }.bind(this));

    ctrl.loadDataFromGeneralService = function () {
        //$scope.contentTitle = GeneralService.contentTitle;
    };

    ctrl.verificarAutenticacion = function () {
        //TODO seteo de variable a true hasta terminar de tener los usuarios definidos
        GeneralService.autentication.isAuthenticated = true;
        GeneralService.showPanels();
        //Fin seteo variables

        if (typeof GeneralService.userLogin !== 'undefined' && typeof GeneralService.userLogin.UserId !== 'undefined' && GeneralService.userLogin.UserId !== null) {
            GeneralService.autentication.isAuthenticated = true;
            GeneralService.showPanels();
        } else {
            window.location.hash = "#!/login";
            window.location.pathname = "Login.html";
        }
    };

    ctrl.loadMenus = function () {
        var dataSP = {
            "StoredProcedureName": "GetActiveMenus",
            "StoredParams": []
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    ctrl.orderMenus(response.Value[0].DataMapped);
                }
            }
        });
    };

    ctrl.loadAllLevels = function () {
        ctrl.allLevels = ctrl.allMenus.map(function (menuData) {
            return {
                Level: menuData.Level
            };
        }).unique("Level");
    };

    ctrl.loadMenusByLevels = function () {
        ctrl.menusByLevel = [];
        $.each(ctrl.allLevels, function (i, levelMenu) {
            var objMenu = { 'Level': levelMenu.Level, 'Menus': $filter('filter')(ctrl.allMenus, { 'Level': levelMenu.Level }) };
            ctrl.menusByLevel.push(objMenu);
        });
    };

    ctrl.orderMenus = function (data) {
        ctrl.allMenus = angular.copy(data);
        ctrl.loadAllLevels();
        ctrl.loadMenusByLevels();
        $.each(ctrl.menusByLevel, function (i, menuByLevel) {
            var nextLevel = i + 1;
            $.each(menuByLevel.Menus, function (j, objMenu) {
                if (nextLevel < ctrl.menusByLevel.length) {
                    var parentMenu = $filter('filter')(ctrl.menusByLevel[nextLevel].Menus, { 'MenuId': objMenu.ParentMenuId }, true);
                    if (parentMenu.length > 0) {
                        if (typeof parentMenu[0].MenusByLevel === 'undefined') parentMenu[0].MenusByLevel = [];
                        parentMenu[0].MenusByLevel.push(objMenu);
                    }
                } else {
                    ctrl.menus.push(objMenu);
                }
            });
        });
        GeneralService.userLogin.Menus = angular.copy(ctrl.menus);
        GeneralService.userLogin.menusByLevel = angular.copy(ctrl.menusByLevel);
        GeneralService.userLogin.allMenus = angular.copy(ctrl.allMenus);
    };

    ctrl.recursiveMenus = function (objMenu) {
        objMenu.CurrentLevel++;
        if (objMenu.CurrentLevel >= objMenu.Level) {
            $.each(ctrl.menus);
        } else {
            ctrl.recursiveMenus(objMenu);
        }
    };

    ctrl.signOut = function () {
        $rootScope.$broadcast('clearState');
        window.location.hash = "#!/login";
        window.location.pathname = "Login.html";
    };

    //BEGIN General Buttons
    ctrl.saveBtnFunction = $rootScope.saveBtnFunction;
    ctrl.saveBtnFunction = $rootScope.clearBtnFunction;
    ctrl.saveBtnFunction = $rootScope.cancelBtnFunction;
    //END General Buttons

    ctrl.changeMenu = function () {
        $timeout(function () {
            ctrl.extractFromUrl();
        }, 500);
    };

    ctrl.extractFromUrl = function () {
        ctrl.currentMenuIdByLevel = [];
        ctrl.loadAllLevels();
        $.each(ctrl.allLevels, function (i, obj) {
            ctrl.currentMenuIdByLevel[parseInt(obj.Level)] = -1;
        });
        ctrl.currentUrl = window.location.hash;
        var aCurrentMenu = $filter('filter')(ctrl.allMenus, { 'Url': ctrl.currentUrl }, true);
        if (aCurrentMenu.length > 0) {
            var objCurrentMenu = angular.copy(aCurrentMenu[0]);
            ctrl.currentMenuIdByLevel[parseInt(objCurrentMenu.Level)] = objCurrentMenu.MenuId;
            if (objCurrentMenu.ParentMenuId !== "") {
                var aCurrentParentMenu = $filter('filter')(ctrl.allMenus, { 'MenuId': objCurrentMenu.ParentMenuId }, true);
                if (aCurrentParentMenu.length > 0) {
                    var objCurrentParentMenu = angular.copy(aCurrentParentMenu[0]);
                    ctrl.currentMenuIdByLevel[parseInt(objCurrentParentMenu.Level)] = objCurrentParentMenu.MenuId;
                    if (objCurrentParentMenu.ParentMenuId !== "") {
                        var aCurrentLastParentMenu = $filter('filter')(ctrl.allMenus, { 'MenuId': objCurrentParentMenu.ParentMenuId }, true);
                        if (aCurrentLastParentMenu.length > 0) {
                            var objCurrentLastParentMenu = angular.copy(aCurrentLastParentMenu[0]);
                            ctrl.currentMenuIdByLevel[parseInt(objCurrentLastParentMenu.Level)] = objCurrentLastParentMenu.MenuId;
                        }
                    }
                }
            }
        }
    };

    angular.element(document).ready(init);

    function init() {
        ctrl.verificarAutenticacion();
        if (ctrl.autentication.isAuthenticated) {
            ctrl.loadDataFromGeneralService();
            if (typeof GeneralService.userLogin.Menus === 'undefined')
                ctrl.loadMenus();
            else if (ctrl.menus.length === 0) {
                ctrl.menus = angular.copy(GeneralService.userLogin.Menus);
                ctrl.menusByLevel = angular.copy(GeneralService.userLogin.menusByLevel);
                ctrl.allMenus = angular.copy(GeneralService.userLogin.allMenus);
                ctrl.extractFromUrl();
            }
            ctrl.changeMenu();
        }
    }
}