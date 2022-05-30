agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('comprobantesController', ["$scope", '$rootScope', "$location", "GeneralService", comprobantesController]);
function comprobantesController($scope, $rootScope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();
    $rootScope.showSaveButton = true;
    $scope.aLanguage = aLanguage;
    $scope.account = "14350101";
    $scope.document = { id: 0, fecha: moment().format('YYYY/MM/DD'), usuario: GeneralService.userLogin.UserCompleteName };
    $scope.comprobanteDetalleDebito = {

        codeaccount: $scope.account,
        movement: "Debit",
        identification: "901492867",
        branch_office: "0",
        productId: null,
        productoId: null,
        warehouse: "",
        quantity: 0,
        description: "",
        value: 0

    };


    $scope.productList = [];
    $scope.dataGridProduct = [];




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
                    $scope.productList = angular.copy(response.Value[0].DataMapped);
                }
            }
        });
    };

    $rootScope.saveBtnFunction = function () {
        if ($("#frmComprobante").valid() && $scope.validateDataGridProduct()) {
            $scope.saveComprobante();
        }
    };
    $scope.comprobante = { document: { id: "" }, date: null, items: [], observations: "" };
    $scope.saveComprobante = function () {
        GeneralService.executeAjax({
            url: 'api/GetNumberCC',
            params: { apiToken: GeneralService.userLogin.access_token},
            success: function (response) {
                if (response.Value) {
                    var totalCredit = 0;
                    $scope.comprobante.date = $scope.document.fecha;
                    $.each($scope.dataGridProduct, function (i, objProduct) {

                        var newProduct = {
                            account: { code: $scope.account, movement: "Debit" },
                            customer: { identification: "901492867", branch_office: "0" },
                            product: { code: objProduct.code, warehouse: objProduct.warehouse, quantity: objProduct.quantity },
                            description: objProduct.description,
                            value: objProduct.value
                        };
                        totalCredit += objProduct.value;
                        $scope.comprobante.items.push(newProduct);
                    });
                    var newProductCredit = {
                        account: { code: "11050501", movement: "Credit" },
                        customer: { identification: "901492867", branch_office: "0" },
                        description: "Credito",
                        value: totalCredit
                    };
                    $scope.comprobante.items.push(newProductCredit);

                    var dataSP = {
                        "StoredProcedureName": "SaveComprobante",
                        "StoredParams": [{
                            Name: "jsonComprobante",
                            Value: JSON.stringify($scope.comprobante)
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
                                $location.path('/listUsers');
                            } else {
                                GeneralService.showToastR({
                                    body: aLanguage[response.GeneralError],
                                    type: 'error'
                                });
                            }
                        }
                    });
                } else {
                    GeneralService.showToastR({
                        body: aLanguage[response.GeneralError],
                        type: 'error'
                    });
                }
            }
        });
    }



    $scope.validateDataGridProduct = function () {
        var returnValue = true;
        if ($scope.dataGridProduct.length > 0) {
            $.each($scope.dataGridProduct, function (i, objProduct) {
                if (typeof objProduct.productoId === 'undefined' || objProduct.productoId === null || objProduct.productoId === "" || objProduct.cantidad <= 0) {
                    GeneralService.showToastR({
                        body: "Todos los productos agregados, deben tener una cantidad correcta",
                        type: 'error'
                    });
                    returnValue = false;
                    return;
                }
            });

        } else {
            GeneralService.showToastR({
                body: "Debe agregar al menos 1 producto",
                type: 'error'
            });
            returnValue = false;
        }
        return returnValue;
    };
    $scope.rowPosition = 0;
    $scope.addProduct = function () {
        rowPosition = $scope.dataGridProduct.length;
        var newProductTemp = angular.copy($scope.comprobanteDetalleDebito);
        newProductTemp.rowPosition = $scope.rowPosition;
        $scope.rowPosition++;
        $scope.dataGridProduct.push(newProductTemp);
        $('[data-toggle="tooltip"]').tooltip();

        setTimeout(function () {
            $('#slProducto' + newProductTemp.rowPosition).select2({
                placeholder: "Seleccione una opción"
            });
        }, 300);
    };

    $scope.removeProducto = function (rowIndex) {
        $('[data-toggle="tooltip"]').tooltip('dispose');
        $scope.dataGridProduct.splice(rowIndex, 1);
        $('[data-toggle="tooltip"]').tooltip();
    };

    $scope.setProduct = function (product, index) {
        var selectedProduct = $scope.productList.filter(p => p.id === product.productoId)[0];
        if (selectedProduct.warehouses !== "") {
            product.warehouseId = JSON.parse(selectedProduct.warehouses)[0].id;
        }
        product.code = selectedProduct.code;
    };

    angular.element(document).ready(init);

    function init() {
        $scope.loadProducts();
    }

    $(document).ready(function () {
        $('.datepicker').datepicker({
            format: 'yyyy/mm/dd'
        });
        $('.select2cls').select2({
            placeholder: "Seleccione una opción"
        });
        $("#frmCotizacion").validate({
            rules: {
                cliente: {
                    required: true
                },
                fechaElaboracion: {
                    required: true,
                    dateISO: true
                },
                //contacto: {
                //    required: true
                //},
                //encabezado: {
                //    required: true
                //},
                //condicionesComerciales: {
                //    required: true
                //}
            }
        });
    });
}