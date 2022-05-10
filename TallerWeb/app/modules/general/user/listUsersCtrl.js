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
        {
            headerName: aLanguage.actions, cellStyle: { "text-align": "Center" }, cellRenderer: function (row) {
                return "<button style='height: 1rem;' class='btn btn-sm btn-icon' ng-click='modUserId(" + row.data.UserId +")'><i class='flaticon-edit'></i></button>";
            }
        }
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
        },
        angularCompileRows: true
    };

    $scope.loadUsers = function () {
        var dataSP = {
            "StoredProcedureName": "GetAllActiveUsers",
            "StoredParams": []
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.listUsersGrid.api.setRowData(response.Value[0].DataMapped);

                }
            }
        });
    };

    $scope.addUser = function () {
        GeneralService.userId = -1;
        $location.path('/addUser');
    };

    $scope.modUserId = function (UserId) {
        GeneralService.userId = UserId;
        $location.path('/addUser');
    };

    angular.element(document).ready(init);

    function init() {
        $scope.loadUsers();
    }
}