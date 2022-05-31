agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('recepcionProductoController', ["$scope", '$rootScope', "$location", "GeneralService", recepcionProductoController]);
function recepcionProductoController($scope, $rootScope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();
    $rootScope.showSaveButton = true;
    $rootScope.showCancelButton = true;
    $scope.aLanguage = aLanguage;

    var IdRecepcionProducto = 1// GeneralService.IdRecepcionProducto;
    GeneralService.IdRecepcionProducto = null;

    $scope.recepcionProducto = {
        IdRecepcionProducto: typeof IdRecepcionProducto === 'undefined' ? null : IdRecepcionProducto,
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
        productoId: null,
        cantidad: 1,
    };

    $scope.productList = [];
    $scope.dataGridProduct = [];
    $scope.customerList = [];
    $scope.contactos = [];

    $scope.loadRecepcionProducto = function () {
        var dataSP = {
            "StoredProcedureName": "GetRecepcionProducto",
            "StoredParams": [{
                Name: "IdRecepcionProducto",
                Value: $scope.recepcionProducto.IdRecepcionProducto
            }]
        };

        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    var recepcionProducto = angular.copy(response.Value[0].DataMapped[0]);
                    $scope.recepcionProducto.fechaElaboracion = moment(recepcionProducto.FechaElaboracion).format('YYYY/MM/DD');
                    $scope.recepcionProducto.responsableRecepcionProductoId = recepcionProducto.IdResponsableRecepcionProducto;
                    $scope.recepcionProducto.responsableRecepcionProducto = recepcionProducto.NombreResponsableRecepcionProducto;
                    $scope.recepcionProducto.cliente = recepcionProducto.IdCliente;
                    $scope.recepcionProducto.notas = recepcionProducto.Notas;

                    var aProducts = angular.copy(response.Value[1].DataMapped);
                    var aProductsPropValues = angular.copy(response.Value[2].DataMapped);
                    $.each(aProducts, function (i, objProduct) {
                        var newProductTemp = angular.copy($scope.newProduct);
                        newProductTemp.rowPosition = $scope.rowPosition;
                        $scope.rowPosition++;

                        newProductTemp.cantidad = parseInt(objProduct.Cantidad);
                        newProductTemp.descripcion = objProduct.DescripcionProducto;
                        newProductTemp.productoId = objProduct.IdProducto;

                        $scope.dataGridProduct.push(newProductTemp);
                        $scope.fillProduct(newProductTemp.rowPosition, false);

                        $.each($scope.dataGridProduct[i].productPropertiesSelected, function (j, propertyProd) {
                            var aProperties = aProductsPropValues.filter(p => p.IdProductoRecepcionProducto === objProduct.IdProductoRecepcionProducto && p.IdProductProperty === propertyProd.IdProductProperty);
                            if (aProperties.length > 0) {
                                propertyProd.Value = aProperties[0].ValueOption;
                            }
                        });

                    });
                }
            }
        });
    };

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

                    if ($scope.recepcionProducto.IdRecepcionProducto !== null) {
                        $rootScope.showSaveButton = false;
                        $rootScope.showPrintButton = true;
                        $scope.loadRecepcionProducto();
                    }
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

    $rootScope.cancelBtnFunction = function () {
        $location.path('/listRecepcionProductos');
    };

    $rootScope.saveBtnFunction = function () {
        if ($("#cliente").val() === '? string: ?') {
            GeneralService.showToastR({
                body: "Por favor seleccione un cliente",
                type: 'error'
            });
            return;
        }
        if ($("#frmRecepcionProductos").valid() && $scope.validateDataGridProduct()) {
            $scope.saveRecepcionProductos();
        }
    };
    
    $rootScope.printBtnFunction = function () {
        var PDFEntity = {
            PDFType: 1,
            id: $scope.recepcionProducto.IdRecepcionProducto
        };
        GeneralService.executeAjax({
            url: 'api/PrintPDF',
            data: PDFEntity,
            success: function (response) {
                debuggger;
                //if (typeof response !== 'undefined' && typeof response.UserId !== 'undefined' && response.UserId !== 0) {
                //} else {
                //    GeneralService.showToastR({
                //        body: 'Usuario o contraseña incorrecta',
                //        type: 'error'
                //    });
                //    $scope.loading = false;
                //}
            },
            funcionIncorrecto: function () { $scope.loading = false; }
        });
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
                if (response.Value.length === 1) {
                    GeneralService.showToastR({
                        body: aLanguage.saveSuccessful,
                        type: 'success'
                    });
                    response.Value[0].DataMapped[0].IdRecepcionProducto;
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

    $scope.fillProduct = function (rowIndex, openModal = true) {
        $scope.selectedProduct = rowIndex;
        var productPropertiesSelected = angular.copy($scope.productProperties.filter(p => p.IdProduct === $scope.dataGridProduct[rowIndex].productoId));
        if (productPropertiesSelected.length === 0)
            productPropertiesSelected = angular.copy($scope.productProperties.filter(p => p.IdProduct === ''));

        $.each(productPropertiesSelected, function (i, objProp) {
            objProp.Options = angular.copy($scope.productPropertyOptions.filter(o => o.IdProductProperty === objProp.IdProductProperty));
        });

        $scope.dataGridProduct[rowIndex].productPropertiesSelected = angular.copy(productPropertiesSelected);
        if (openModal)
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