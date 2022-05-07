agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('listUsersController', ["$scope", "$location", "GeneralService", listUsersController]);
function listUsersController($scope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();

    $scope.aLanguage = aLanguage;
    $scope.userIdSelected = typeof GeneralService.userId !== 'undefined' ? GeneralService.userId : -1;

    $scope.columnDefs = [
        { headerName: aLanguage.name, field: "UserFirstName" },
        { headerName: aLanguage.surnames, field: "UserLastName" },
        { headerName: aLanguage.email, field: "UserEmail" },
        { headerName: aLanguage.actions, field: "-" }
    ];

    $scope.rowData = [];

    $scope.listUsersGrid = {
        localeText: $scope.aLanguage.localeTextAgGrid,
        columnDefs: $scope.columnDefs,
        rowData: $scope.rowData,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        enableColResize: true,
        defaultColDef: {
            sortable: true,
            filter: true,
            resize: true
        }
    };

    $scope.loadUsers = function () {
        GeneralService.executeAjax({
            url: 'api/getAllUsers',
            success: function (response) {
                if (response.Exception !== null) {
                    $scope.listUsersGrid.api.setRowData(response);
                }
            }
        });
    };

    $scope.addUser = function () {
        GeneralService.userId = -1;
        $location.path('/addUser');
    };

    $scope.modUserId = function () {
        GeneralService.userId = $scope.userIdSelected;
    };

    angular.element(document).ready(init);

    function init() {
        $scope.loadUsers();
    }
}