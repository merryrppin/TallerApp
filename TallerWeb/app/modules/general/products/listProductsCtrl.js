agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('listProductsController', ["$scope", "$location", "GeneralService", listProductsController]);
function listProductsController($scope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();

    $scope.aLanguage = aLanguage;
    $scope.columnDefs = [
        { headerName: 'Codigo', field: "code", width: 110},
        { headerName: 'Nombre', field: "name", width: 315},
        { headerName: 'Tipo', field: "type", width: 110},
        {
            headerName: 'Control Stock', field: "stock_control", width: 140, editable: false, cellStyle: { "text-align": "Center" }, cellRenderer: function (row) {
                let html = "";
                if (row.data.stock_control == "True") {
                    html += "<i class='kt - menu__link - icon flaticon2-check-mark'></i>"
                }
                else {
                    html += "<i class='kt - menu__link - flaticon2-cross'></i>"
                }
                
                return html;
            }},
        {
            headerName: 'Activo', field: "active", width: 120, editable: false, cellStyle: { "text-align": "Center" }, cellRenderer: function (row) {
                let html = "";
                if (row.data.active == "True") {
                    html += "<i class='kt - menu__link - icon flaticon2-check-mark'></i>"
                }
                else {
                    html += "<i class='kt - menu__link - flaticon2-cross'></i>"
                }

                return html;
            }
        },
        {
            headerName: 'Incluye Impuesto', field: "tax_incluided", width: 150, editable: false, cellStyle: { "text-align": "Center" }, cellRenderer: function (row) {
                let html = "";
                if (row.data.tax_incluided == "True") {
                    html += "<i class='kt - menu__link - icon flaticon2-check-mark'></i>"
                }
                else {
                    html += "<i class='kt - menu__link - flaticon2-cross'></i>"
                }

                return html;
            } },
        { headerName: 'Impuestos', field: "taxes",width: 120 },
        { headerName: 'Cantidad Disponible', field: "available_quantity", width: 170 }
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
                    let data = response.Value[0].DataMapped;
                    data.taxes = data.taxes == null ? data.taxes:JSON.parse(data.taxes);
                    $scope.listProductsGrid.api.setRowData(data);
                    
                }
            }
        });
    };



    angular.element(document).ready(init);

    function init() {
        $scope.loadProducts();
    }
}