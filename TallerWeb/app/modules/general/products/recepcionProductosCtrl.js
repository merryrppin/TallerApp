agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('recepcionProductoController', ["$scope", '$rootScope', "$location", "GeneralService", recepcionProductoController]);
function recepcionProductoController($scope, $rootScope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();
    $rootScope.showSaveButton = true;
    $scope.aLanguage = aLanguage;

    $scope.recepcionProducto = {
        tipoN: 'R-1-Recepción',
        numero: '',
        cliente: '',
        fechaElaboracion: moment().format('YYYY/MM/DD'),
        responsableRecepcionProducto: GeneralService.userLogin.UserCompleteName,
        responsableRecepcionProductoId: GeneralService.userLogin.UserId,
        notas: '',
    };

    $scope.newProduct = {
        descripcion: '',
        productId: null,
        productoId: null,
        cantidad: 1,
    };

    $scope.productList = [];
    $scope.dataGridProduct = [];
    $scope.customerList = [];
    $scope.contactos = [];

    $scope.loadCustomers = function () {
        var dataSP = {
            "StoredProcedureName": "GetCustomers",
            "StoredParams": []
        };

        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.customerList = response.Value[0].DataMapped.map(function (objCustomer) {
                        objCustomer.name = objCustomer.name.replace('["', '').replace('"]', '').replace('","', ' ');
                        var aContacts = [];
                        if (objCustomer.contacts != null && objCustomer.contacts != '') {
                            aContacts = JSON.parse(objCustomer.contacts);
                        }
                        objCustomer.contactos = aContacts;
                        return objCustomer;
                    });
                }
            }
        });
    };

    $scope.productProperties = [];
    $scope.productPropertyOptions = [];

    $scope.loadProductInformation = function () {
        var dataSP = {
            "StoredProcedureName": "GetProductInformationToFill",
            "StoredParams": []
        };

        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.productProperties = angular.copy(response.Value[0].DataMapped);
                    $scope.productPropertyOptions = angular.copy(response.Value[1].DataMapped);
                }
            }
        });
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
                    $scope.productList = angular.copy(response.Value[0].DataMapped);
                }
            }
        });
    };

    $rootScope.saveBtnFunction = function () {
        if ($("#frmRecepcionProductos").valid() && $scope.validateDataGridProduct()) {
            $scope.saveRecepcionProductos();
        }
    };

    $rootScope.printBtnFunction = function () {
        //Print PDF
    };

    $scope.saveRecepcionProductos = function () {
        var aDataProducts = [];
        var aDataProductsValues = [];
        $.each($scope.dataGridProduct, function (i, objProduct) {
            var productTempId = new Date().getTime();
            var productValue = objProduct.productPropertiesSelected.map(function (objProperty) {
                var ValueOpt = objProperty.PropertyHT === "True" ? (typeof objProperty.Value === 'undefined' ? '' : objProperty.Value) : objProperty.Value.IdProductPropertyOption;
                return {
                    productTempId: productTempId,
                    IdProduct: objProperty.IdProduct,
                    IdProductProperty: objProperty.IdProductProperty,
                    Value: ValueOpt
                };
            });
            var newProduct = {
                productTempId: productTempId,
                cantidad: objProduct.cantidad,
                descripcion: objProduct.descripcion,
                descuento: objProduct.descuento,
                impuestoretencion: objProduct.impuestoretencion,
                productoId: objProduct.productoId,
                taxId: objProduct.taxId,
                taxes: objProduct.taxes,
                totalProducto: objProduct.totalProducto,
                valorunitario: objProduct.valorunitario,
            };
            aDataProducts.push(newProduct);
            aDataProductsValues = angular.copy(productValue);
        });

        var dataSP = {
            "StoredProcedureName": "SaveRecepcionProducto",
            "StoredParams": [{
                Name: "jsonRecepcionProducto",
                Value: JSON.stringify($scope.recepcionProducto)
            }, {
                Name: "jsonProductos",
                Value: JSON.stringify(aDataProducts)
            }, {
                Name: "jsonValoresProductos",
                Value: JSON.stringify(aDataProductsValues)
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
                    $rootScope.showPrintButton = true;
                } else {
                    GeneralService.showToastR({
                        body: aLanguage[response.GeneralError],
                        type: 'error'
                    });
                }
            }
        });
    };

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
        var newProductTemp = angular.copy($scope.newProduct);
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

    $scope.selectedProduct = -1;

    $scope.openModal = function (rowIndex) {
        $scope.selectedProduct = rowIndex;
        $('#modalFillDataProduct').modal('show');
    };

    $scope.fillProduct = function (rowIndex) {
        $scope.selectedProduct = rowIndex;
        var productPropertiesSelected = angular.copy($scope.productProperties.filter(p => p.IdProduct === $scope.dataGridProduct[rowIndex].productoId));
        if (productPropertiesSelected.length === 0)
            productPropertiesSelected = angular.copy($scope.productProperties.filter(p => p.IdProduct === ''));

        $.each(productPropertiesSelected, function (i, objProp) {
            objProp.Options = angular.copy($scope.productPropertyOptions.filter(o => o.IdProductProperty === objProp.IdProductProperty));
        });

        $scope.dataGridProduct[rowIndex].productPropertiesSelected = angular.copy(productPropertiesSelected);
        $('#modalFillDataProduct').modal('show');
    };

    $scope.selectCliente = function () {
        //$scope.contactos = angular.copy($scope.customerList.filter(p => p.id === $scope.cotizacion.cliente)[0]);
    };

    $scope.setProduct = function (product) {
        var selectedProduct = $scope.productList.filter(p => p.id === product.productoId)[0];
        product.ProductName = selectedProduct.name;

        $scope.fillProduct(product.rowPosition);
    };

    angular.element(document).ready(init);

    function init() {
        $scope.loadCustomers();
        $scope.loadProducts();
        $scope.loadProductInformation();
    }

    $(document).ready(function () {
        $('.datepicker').datepicker({
            format: 'yyyy/mm/dd'
        });
        $('.select2cls').select2({
            placeholder: "Seleccione una opción"
        });
        $("#frmRecepcionProductos").validate({
            rules: {
                cliente: {
                    required: true
                },
                fechaElaboracion: {
                    required: true,
                    dateISO: true
                }
            }
        });
    });
}