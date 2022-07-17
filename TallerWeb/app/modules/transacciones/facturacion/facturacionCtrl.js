agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('facturacionController', ["$scope", '$rootScope', "$location", "GeneralService", facturacionController]);
function facturacionController($scope, $rootScope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();

    //#region variables
    $rootScope.showSaveButton = true;
    $scope.aLanguage = aLanguage;
    $scope.document = { id: 0, fecha: moment().format('YYYY/MM/DD'), usuario: GeneralService.userLogin.UserCompleteName };
    $scope.productList = [];
    $scope.dataGridProduct = [];
    $scope.customerList = [];
    $scope.quoteList = [];
    $scope.quoteSelected = [];
    $scope.dataGridProduct = [];
    $scope.rowPosition = 0;
    $scope.productList = [];
    $scope.newProduct = {
        descripcion: '',
        productoId: null,
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
    //#endregion variables

    //#region factura
    $scope.selectQuotes = function () {
        $scope.quoteSelected = $scope.quoteList.filter(x => x.CustomerId == $scope.CustomerId);
        if ($scope.quoteSelected.length === 0) {
            GeneralService.showToastR({
                body: aLanguage.NotQuotationFoundByClient,
                type: 'info'
            });
        }
    };

    $scope.generateInvoice = function () {
        Swal.fire({
            title: 'Está seguro de guardar la factura?',
            showDenyButton: true,
            confirmButtonText: 'Guardar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                updateQuotationQuantity(data);
                Swal.fire('Cambios guardados!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info')
            }
        })
    };

    $scope.editInvoice = function () {
        $("#modal1").modal('show');
    };

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
        $scope.recalculateTotal();
    };

    //#endregion factura

    //#region execute procedures
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

    $scope.loadQuotes = function () {
        var dataSP = {
            "StoredProcedureName": "GetCotizaciones",
            "StoredParams": []
        };

        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.quoteList = angular.copy(response.Value[0].DataMapped);
                }
            }
        });
    };

    $scope.loadCustomers = function () {
        var dataSP = {
            "StoredProcedureName": "GetCustomersTest",
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

    $scope.SearchInvoice = function () {
        let customerId = typeof $scope.CustomerId == 'undefined' ? '00000000-0000-0000-0000-000000000000' : $scope.CustomerId;
        let quotationId = typeof $scope.IdCotizacion == 'undefined' ? -1 : $scope.IdCotizacion;
        let creationDate = typeof $scope.document.fecha == 'undefined' ? '' : $scope.document.fecha;

        var dataSP = {
            "StoredProcedureName": "GetQuotationForProof",
            "StoredParams": [
                { Name: "CustomerId", Value: customerId },
                { Name: "QuotationId", Value: quotationId },
                { Name: "CreationDate", Value: creationDate }
            ]
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    let data = response.Value[0].DataMapped;
                    if (data.length == 0) {
                        $scope.listQuotationGrid.api.setRowData([]);
                        GeneralService.showToastR({
                            body: aLanguage.NotFound,
                            type: 'info'
                        });
                    } else {
                        $scope.listQuotationGrid.api.setRowData(data);
                        GeneralService.showToastR({
                            body: aLanguage.RecordsLoaded,
                            type: 'success'
                        });
                    }
                }
            }
        });
    };

    function updateQuotationQuantity(data) {
        var dataSP = {
            "StoredProcedureName": "UpdateQuotation",
            "StoredParams": [
                { Name: "Username", Value: GeneralService.userLogin.UserCompleteName },
                { Name: "Quantity", Value: parseInt(data.Cantidad) },
                { Name: "IdProductoCotizacion", Value: data.IdProductoCotizacion }
            ]
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.SearchInvoice();
                    GeneralService.showToastR({
                        body: aLanguage.saveSuccessful,
                        type: 'success'
                    });
                }
            }
        });


    }
    //#endregion execute procedures

    //#region grid definition

    $scope.aLanguage = aLanguage;
    $scope.columnDefs = [
        { headerName: 'Id Comprobante', field: "IdProof", width: 180 },
        { headerName: 'Nombre Producto', field: "name", width: 180 },
        { headerName: 'Cantidad', field: "Cantidad", width: 160 },
        { headerName: 'Valor Unitario', field: "ValorUnitario", width: 180 },
        { headerName: 'Cantidad Pendiente', field: "CantidadPendiente", width: 180 },
        { headerName: 'Total Producto', field: "TotalProducto", width: 180 },
        { headerName: 'Descuento Total', field: "DescuentoTotal", width: 180 },
        {
            headerName: 'Editar factura', cellStyle: { "text-align": "Center" }, cellRenderer: function (row) {
                var sHtml = "<button style='height: 1rem;' data-toggle='tooltip' title='Click para editar factura' class='btn btn-sm btn-icon' ng-click='editInvoice(" + row.data.IdRecepcionProducto + ")'><i class='fa fa-edit'></i></button>";
                return sHtml;
            }
        }
    ];

    $scope.rowData = [];

    $scope.listQuotationGrid = {
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
        rowSelection: 'multiple',
        angularCompileRows: true
    };

    //#endregion grid definition

    //#region init
    angular.element(document).ready(init);
    function init() {
        $scope.loadCustomers();
        $scope.loadQuotes();
        $scope.loadProducts();
    };
    //#endregion init

    //#region helpers
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
            }
        });
    });

    function validateQuantity(value) {
        if (!/^[0-9]+$/.test(value)) {
            GeneralService.showToastR({
                body: aLanguage.OnlyNumbers,
                type: 'info'
            });
            return false;
        }
        return true;
    };

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    //#endregion helpers
}