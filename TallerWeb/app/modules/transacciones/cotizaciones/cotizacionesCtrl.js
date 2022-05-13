angular.module(aLanguage.appName).controller('cotizacionesController', ["$scope", '$rootScope', "$location", "GeneralService", cotizacionesController]);
function cotizacionesController($scope, $rootScope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();
    $rootScope.showSaveButton = true;
    $scope.aLanguage = aLanguage;

    $scope.total = {
        totalBruto: '0.00',
        descuentos: '0.00',
        subTotal: '0.00',
        totalNeto: '0.00',
    };

    $scope.cotizacion = {
        tipo: '',
        numero: '',
        cliente: '',
        fechaElaboracion: moment().format('YYYY/MM/DD'),
        contacto: '',
        responsableCotizacion: '',
        encabezado: '',
        condicionesComerciales: '',
    };

    $scope.loadUser = function () {
        //var dataSP = {
        //    "StoredProcedureName": "GetUser",
        //    "StoredParams": [{
        //        Name: "UserId",
        //        Value: $scope.userIdSelected
        //    }]
        //};

        //GeneralService.executeAjax({
        //    url: 'api/executeStoredProcedure',
        //    data: dataSP,
        //    success: function (response) {
        //        if (response.Value.length === 1) {
        //            $scope.currentUser = response.Value[0].DataMapped[0];
        //        } else {
        //            GeneralService.showToastR({
        //                body: aLanguage[response.GeneralError],
        //                type: 'error'
        //            });
        //        }
        //    }
        //});
    };

    $scope.columnDefs = [
        { headerName: "Producto", field: "UserFirstName" },
        { headerName: "Descripción", field: "UserFirstName" },
        { headerName: "Cant", field: "UserFirstName" },
        { headerName: "Valor Unitario", field: "UserFirstName" },
        { headerName: "% Desc.", field: "UserFirstName" },
        { headerName: "Impuesto Cargo", field: "UserFirstName" },
        { headerName: "Impuesto Retención", field: "UserFirstName" },
        { headerName: "Valor Total", field: "UserFirstName" }
    ];

    $scope.productList = [];

    $scope.listProductsGrid = {
        localeText: $scope.aLanguage.localeTextAgGrid,
        columnDefs: $scope.columnDefs,
        rowData: $scope.productList,
        suppressRowClickSelection: true,
        enableColResize: true,
        defaultColDef: {
            sortable: false,
            filter: false,
            resize: true
        },
        angularCompileRows: true
    };

    angular.element(document).ready(init);

    function init() {
        if ($scope.userIdSelected !== -1)
            $scope.loadUser();
    }

    $(document).ready(function () {
        $('.datepicker').datepicker({
            format: 'yyyy/mm/dd'
        });
        $('.select2cls').select2();
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