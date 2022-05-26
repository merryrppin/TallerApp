agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('cotizacionesController', ["$scope", '$rootScope', "$location", "GeneralService", cotizacionesController]);
function cotizacionesController($scope, $rootScope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();
    $rootScope.showSaveButton = true;
    $scope.aLanguage = aLanguage;

    $scope.cotizacion = {
        tipo: { 'Name': 'C-1-Cotización' },
        numero: '',
        cliente: '',
        fechaElaboracion: moment().format('YYYY/MM/DD'),
        contacto: 'contacto',//test
        nombreContacto: '',
        responsableCotizacion: GeneralService.userLogin.UserCompleteName,
        responsableCotizacionId: GeneralService.userLogin.UserId,
        encabezado: 'encabezado',//test
        condicionesComerciales: 'condiciones com',//test
        totalBruto: '0.00',
        descuentos: '0.00',
        subTotal: '0.00',
        totalNeto: '0.00',
    };

    $scope.newProduct = {
        descripcion: '',
        productId: null,
        cantidad: 1,
        available_quantity: 0,
        valorunitario: 0,
        descuento: 0,
        taxes: 0,
        impuestoretencion: 0,
        totalProducto: 0,
        taxesList: [],
        taxId: '-1'
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
        if ($("#frmCotizacion").valid() && $scope.validateDataGridProduct()) {
            $scope.saveCotizacion();
        }
    };

    $scope.saveCotizacion = function () {
        debugger;
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

    $scope.addProduct = function () {
        rowPosition = $scope.dataGridProduct.length;
        $scope.dataGridProduct.push(angular.copy($scope.newProduct));
        $('[data-toggle="tooltip"]').tooltip();
        $('#slProducto' + rowPosition).select2({
            placeholder: "Seleccione una opción"
        });
    };

    $scope.removeProducto = function (rowIndex) {
        $('[data-toggle="tooltip"]').tooltip('dispose');
        $scope.dataGridProduct.splice(rowIndex, 1);
        $('[data-toggle="tooltip"]').tooltip();
        $scope.recalculateTotal();
    };

    $scope.selectCliente = function () {
        $scope.contactos = angular.copy($scope.customerList.filter(p => p.id === $scope.cotizacion.cliente)[0]);
    };

    var taxZeroOption = { id: -1, name: "Ninguno", percentage: 0 };

    $scope.setProduct = function (product) {
        var selectedProduct = $scope.productList.filter(p => p.id === product.productoId)[0];
        product.available_quantity = parseFloat(selectedProduct.available_quantity);
        var taxesL = JSON.parse(selectedProduct.taxes);
        if (taxesL.length === 0)
            taxesL.push(taxZeroOption);
        product.taxesList = taxesL;
        product.taxes = taxesL[0].percentage;
        product.taxId = taxesL[0].id.toString();
        if (selectedProduct.prices !== "") {
            product.valorunitario = JSON.parse(selectedProduct.prices)[0].price_list[0].value;
        }
    };

    $scope.setTax = function (product) {
        product.taxes = product.taxesList.filter(t => t.id.toString() === product.taxId.toString())[0].percentage;
        $scope.recalculateTotal(product);
    }

    $scope.recalculateTotal = function (product) {
        if (typeof product !== 'undefined') {
            var valorPorCantidad = product.cantidad * product.valorunitario;
            var descuentoTotal = product.cantidad * ((product.descuento / 100) * product.valorunitario);
            var impuestoCargo = product.cantidad * ((product.taxes / 100) * product.valorunitario);
            var valorTotal = valorPorCantidad - descuentoTotal + impuestoCargo;
            product.totalProducto = valorTotal;
            product.descuentoTotal = descuentoTotal;
            product.impuestoRetencion = descuentoTotal;
            product.impuestoCargo = impuestoCargo;
        }

        var totalBruto = 0;
        var totalDescuentos = 0;
        var subTotal = 0;
        var impuestoTotal = 0;
        $.each($scope.dataGridProduct, function (i, objProduct) {
            totalBruto += objProduct.cantidad * objProduct.valorunitario;
            totalDescuentos += objProduct.descuentoTotal;
            subTotal += totalBruto - totalDescuentos;
            impuestoTotal += objProduct.impuestoCargo;
        });

        $scope.cotizacion.totalBruto = totalBruto;
        $scope.cotizacion.descuentos = totalDescuentos;
        $scope.cotizacion.subTotal = subTotal;
        $scope.cotizacion.totalNeto = $scope.cotizacion.subTotal + impuestoTotal;
    };

    angular.element(document).ready(init);

    function init() {
        $scope.loadCustomers();
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
                condicionesComerciales: {
                    required: true
                }
            }
        });
    });
}