agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('listProductsController', ["$scope", "$location", "GeneralService", listProductsController]);
function listProductsController($scope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();

    $scope.columnDefs = [
        { headerName: 'Codigo', field: "code" },
        { headerName: 'Nombre', field: "name" },
        { headerName: 'Tipo', field: "type" },
        { headerName: 'Control Stock', field: "stock_control" },
        { headerName: 'Activo', field: "active" },
        { headerName: 'Incluye Impuesto', field: "tax_incluided" },
        { headerName: 'Impuestos', field: "taxes" },
        { headerName: 'Cantidad Disponible', field: "available_quantity" }
    ];

    $scope.rowData = [];

    $scope.listProductsGrid = {
        localeText: $scope.aLanguage.localeTextAgGrid,
        columnDefs: $scope.columnDefs,
        rowData: $scope.rowData,
        suppressRowClickSelection: true,
        enableColResize: true,
        defaultColDef: {
            sortable: true,
            filter: true,
            resize: true
        }
    };

    $scope.loadProducts = function () {
        var dataSP = {
            "StoredProcedureName": "GetProducts",
            "StoredParams": []
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.listProductsGrid.api.setRowData(response);
                    
                }
            }
        });
    };



    angular.element(document).ready(init);

    function init() {
        $scope.loadProducts();
    }
}