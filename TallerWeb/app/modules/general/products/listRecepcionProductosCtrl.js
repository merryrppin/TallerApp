agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('listRecepcionProductosController', ["$scope", '$rootScope', "$location", "GeneralService", listRecepcionProductosController]);
function listRecepcionProductosController($scope, $rootScope, $location, GeneralService) {
    GeneralService.hideGeneralButtons();

    $scope.aLanguage = aLanguage;
    $scope.columnDefs = [
        { headerName: 'Id', field: "IdRecepcionProducto", width: 110 },
        { headerName: 'Fecha', field: "FechaElaboracion", width: 110 },
        { headerName: 'Cliente', field: "name", width: 400 },
        {
            headerName: aLanguage.actions, cellStyle: { "text-align": "Center" }, cellRenderer: function (row) {
                var sHtml = "<button style='height: 1rem;' data-toggle='tooltip' title='Abrir recepción producto' class='btn btn-sm btn-icon' ng-click='loadRecepcionProducto(" + row.data.IdRecepcionProducto + ")'><i class='fa fa-truck'></i></button>";
                return sHtml;
            }
        }
    ];

    $scope.loadRecepcionProducto = function (IdRecepcionProducto) {
        $('[data-toggle="tooltip"]').tooltip('dispose');
        GeneralService.IdRecepcionProducto = IdRecepcionProducto;
        $location.path('/recepcionProductos');
    };

    $scope.rowData = [];

    $scope.listRecepcionesProductoGrid = {
        localeText: $scope.aLanguage.localeTextAgGrid,
        columnDefs: $scope.columnDefs,
        rowData: $scope.rowData,
        suppressRowClickSelection: true,
        enableColResize: true,
        defaultColDef: {
            sortable: true,
            filter: true,
            resize: true
        },
        angularCompileRows: true
    };

    $scope.loadCotizaciones = function () {
        var dataSP = {
            "StoredProcedureName": "GetRecepcionesProducto",
            "StoredParams": []
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    let data = response.Value[0].DataMapped;
                    $scope.listRecepcionesProductoGrid.api.setRowData(data);
                }
            }
        });
    };

    angular.element(document).ready(init);

    function init() {
        $scope.loadCotizaciones();
    }

}