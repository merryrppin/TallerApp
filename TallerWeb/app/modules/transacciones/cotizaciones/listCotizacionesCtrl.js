agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('listCotizacionesController', ["$scope", '$rootScope', "$location", "GeneralService", listCotizacionesController]);
function listCotizacionesController($scope, $rootScope, $location, GeneralService) {
    GeneralService.hideGeneralButtons();

    $scope.aLanguage = aLanguage;
    $scope.columnDefs = [
        { headerName: 'Id', field: "IdCotizacion", width: 110 },
        { headerName: 'Fecha', field: "FechaElaboracion", width: 110 },
        { headerName: 'Cliente', field: "name", width: 400 },
        { headerName: 'Total Bruto', field: "TotalBruto", width: 120 },
        { headerName: 'Descuentos', field: "Descuentos", width: 170 },
        { headerName: 'SubTotal', field: "SubTotal", width: 170 },
        { headerName: 'Total Neto', field: "TotalNeto", width: 170 },
        {
            headerName: aLanguage.actions, cellStyle: { "text-align": "Center" }, cellRenderer: function (row) {
                var sHtml = "<button style='height: 1rem;' data-toggle='tooltip' title='Abrir cotización' class='btn btn-sm btn-icon' ng-click='loadCotizacion(" + row.data.IdCotizacion + ")'><i class='fa fa-percentage'></i></button>";
                return sHtml;
            }
        }
    ];

    $scope.loadCotizacion = function (IdCotizacion) {
        $('[data-toggle="tooltip"]').tooltip('dispose');
        GeneralService.IdCotizacion = IdCotizacion;
        $location.path('/cotizaciones');
    };

    $scope.rowData = [];

    $scope.listCotizacionesGrid = {
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
            "StoredProcedureName": "GetCotizaciones",
            "StoredParams": []
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    let data = response.Value[0].DataMapped;
                    $scope.listCotizacionesGrid.api.setRowData(data);
                }
            }
        });
    };

    angular.element(document).ready(init);

    function init() {
        $scope.loadCotizaciones();
    }

}