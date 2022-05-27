agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('listUsersController', ["$scope", "$location", "GeneralService", listUsersController]);
function listUsersController($scope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();

    $scope.aLanguage = aLanguage;
    $scope.userIdSelected = typeof GeneralService.userId !== 'undefined' ? GeneralService.userId : -1;
    $scope.oUser = {};

    $scope.columnDefs = [
        { headerName: aLanguage.name, field: "UserFirstName" },
        { headerName: aLanguage.surnames, field: "UserLastName" },
        { headerName: aLanguage.email, field: "UserEmail" },
        {
            headerName: aLanguage.actions, cellStyle: { "text-align": "Center" }, cellRenderer: function (row) {
                var sHtml = "<button style='height: 1rem;' data-toggle='tooltip' title='Editar usuario' class='btn btn-sm btn-icon' ng-click='modUserId(" + row.data.UserId + ")'><i class='fa fa-edit'></i></button>";
                sHtml += "<button style='height: 1rem;' data-toggle='tooltip'' title='Cambiar contraseña' class='btn btn-sm btn-icon' ng-click='changePassword(" + row.data.UserId + ")'><i class='fa fa-lock'></i></button>";
                return sHtml;
            }
        }
    ];

    $scope.userList = [];

    $scope.listUsersGrid = {
        localeText: $scope.aLanguage.localeTextAgGrid,
        columnDefs: $scope.columnDefs,
        rowData: $scope.userList,
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
                    $scope.userList = angular.copy(response.Value[0].DataMapped);
                    $scope.listUsersGrid.api.setRowData($scope.userList);
                    $('[data-toggle="tooltip"]').tooltip()
                }
            }
        });
    };

    $scope.addUser = function () {
        GeneralService.userId = -1;
        $location.path('/addUser');
    };

    $scope.modUserId = function (UserId) {
        $('[data-toggle="tooltip"]').tooltip('dispose');
        GeneralService.userId = UserId;
        $location.path('/addUser');
    };

    $scope.changePassword = function (UserId) {
        validator.resetForm();
        $scope.oUser = angular.copy($scope.userList.filter(x => x.UserId === UserId.toString())[0]);
        $('#modalChangePassword').modal('show');
    };

    $scope.updatePassword = function () {
        if ($("#frmChangePassword").valid()) {
            $scope.encryptPassword($scope.oUser.Password);
        }
    };

    $scope.saveUser = function (UserId, PasswordEncrypt) {
        var dataSP = {
            "StoredProcedureName": "UpdatePasswordUser",
            "StoredParams": [{
                Name: "UserId",
                Value: UserId
            }, {
                Name: "PasswordEncrypt",
                Value: PasswordEncrypt
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
                    $('#modalChangePassword').modal('hide');
                    $scope.oUser = {};
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
                $scope.saveUser($scope.oUser.UserId, response);
            }
        });
    };

    angular.element(document).ready(init);

    function init() {
        $('#modalChangePassword').modal({ show: false });
        $scope.loadUsers();
    }

    var validator;

    $(document).ready(function () {
        validator = $("#frmChangePassword").validate({
            rules: {
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