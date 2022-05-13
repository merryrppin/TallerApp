agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('cotizacionesController', ["$scope", '$rootScope', "$location", "GeneralService", cotizacionesController]);
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
        tipo: { 'Name': 'C-1-Cotización' },
        numero: '',
        cliente: '',
        fechaElaboracion: moment().format('YYYY/MM/DD'),
        contacto: '',
        responsableCotizacion: '',
        encabezado: '',
        condicionesComerciales: '',
    };

    $scope.newProduct = {
        productId: '',
        cantidad: 0,
        valorunitario: 0.0,
        descuento: 0.0,
        impuestocargo: 0.0,
        impuestoretencion: 0.0,
        totalProducto: 0.0
    };

    $scope.productList = [];
    $scope.dataGridProduct = [];
    //$scope.dataGridProduct = [angular.copy($scope.newProduct)];
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
                        objCustomer.name = objCustomer.name.replace('["', '').replace('"]', '');
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
        recalculateTotal()
    };

    $scope.recalculateTotal = function (product) {
        if (typeof product !== 'undefined') {
            var valorPorCantidad = product.cantidad * product.valorunitario;
            var descuentoTotal = product.cantidad * ((product.descuento / 100) * product.valorunitario);
            var impuestoCargo = product.cantidad * ((product.impuestocargo / 100) * product.valorunitario);
            var impuestoRetencion = product.cantidad * ((product.impuestoretencion / 100) * product.valorunitario);
            var valorTotal = valorPorCantidad - descuentoTotal + impuestoCargo + impuestoRetencion;
            product.totalProducto = valorTotal;
            product.descuentoTotal = descuentoTotal;
        }

        var totalBruto = 0;
        var totalDescuentos = 0;
        var subTotal = 0;
        var subTotalNeto = 0;
        $.each($scope.dataGridProduct, function (i, objProduct) {
            totalBruto += objProduct.totalProducto;
            totalDescuentos += objProduct.descuentoTotal;
        });

        $scope.total.totalBruto = totalBruto;
        $scope.total.descuentos = totalDescuentos;
        //$scope.total = {
        //    totalBruto: '0.00',
        //    descuentos: '0.00',
        //    subTotal: '0.00',
        //    totalNeto: '0.00',
        //};
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