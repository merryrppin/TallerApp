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
    $scope.receiptSelected = [];
    $scope.dataGridProduct = [];
    $scope.rowPosition = 0;
    $scope.productList = [];
    $scope.codesReceipt = [];
    $scope.receiptName = '';
    $scope.settings = [];
    $scope.accountingReceiptTypes = [];
    $scope.document.fecha = null;
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
    function saveSiigoInvoice() {
        let items = []
        let creditValue = 0;
        $scope.listProductQuotationId = [];
        let creationdate = new Date();

        $scope.listRecepitGrid.api.forEachNode(function (row, node) {
            if (row.selected === true) {
                creditValue += parseFloat(row.data.ValorUnitario);
                $scope.listProductQuotationId.push({ 'ProductQuotationId': row.data.IdProductoCotizacion });
                items.push(
                    {
                        "code": row.data.code.replace(/ /g, ''),
                        "description": row.data.DescripcionProducto,
                        "quantity": parseInt(row.data.Cantidad),
                        "price": parseFloat(row.data.ValorUnitario),
                        "discount": parseFloat(row.data.DescuentoTotal),
                        "taxes": [] //(Opcional) Array con los id de los impuestos tipo ReteICA, ReteIVA o Autoretención
                    }
                );
            }
        });

        let invoice =
        {
            "document": {
                "id": 26870 //Identificador del tipo de comprobante ejemplo Factura electrónica de venta : https://api.siigo.com/v1/document-types?type=FV
            },
            "date": creationdate.toISOString().split('T')[0],
            "customer": {
                "identification": $scope.settings[0].NIT,//	Array de los datos del cliente asociados a la factura.
                "branch_office": 0
            },
            "cost_center": [],//(Opcional) Identificador del Centro de costos.
            "seller": 735, //Identificador asociado a la factura --User name  en este caso se toma de ejemplo : ventas@agroequiposalpujarra.com
            "observations": "Observaciones",
            "items": items,
            "payments": [
                {
                    "id": 29, //Crédito- prueba
                    "value": creditValue,
                    "due_date": creationdate.toISOString().split('T')[0]
                } //Array de las formas de pago asociadas a la factura. https://api.siigo.com/v1/payment-types?document_type=FV
            ],
            "additional_fields": {}
        }

        let Invoice = angular.copy(GeneralService.userLogin);
        Invoice.Invoice = JSON.stringify(invoice);

        GeneralService.executeAjax({
          // url: 'api/CreateInvoice', TODO
            data: Invoice,
            success: function (response) {
                var result = JSON.parse(response);
                if (result) {
                    if (result.Errors) {
                        GeneralService.showToastR({
                            body: result.Errors[0].Code,
                            type: 'error'
                        });
                    } else {
                        saveInvoice(result);
                    }
                } else {
                    GeneralService.showToastR({
                        body: result.Errors[0].Code,
                        type: 'error'
                    });
                }
            }
        });
    }


    $scope.generateInvoice = function () {
        let isValidSelected = false;

        $scope.listRecepitGrid.api.forEachNode(function (row, node) {
            if (row.selected === true) {
                isValidSelected = true;
            }
        });

        if (!isValidSelected) {
            GeneralService.showToastR({
                body: 'Debes selecionar al menos un comprobante',
                type: 'info'
            });
            return;
        }

        Swal.fire({
            title: 'Está seguro de generar la factura?',
            showDenyButton: true,
            confirmButtonText: 'Guardar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                saveSiigoInvoice();
                Swal.fire('Comprobante generado!', '', 'success')
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
    function saveInvoice(resultSiigo) {
        $scope.ReceiptName = resultSiigo.name;
        var dataSP = {
            "StoredProcedureName": "saveInvoice",
            "StoredParams": [
                { Name: "JsonProductQuotationId", Value: JSON.stringify($scope.listProductQuotationId) },
                { Name: "InvoiceId", Value: resultSiigo.id },
                { Name: "InvoiceName", Value: $scope.ReceiptName },
                { Name: "Username", Value: GeneralService.userLogin.UserCompleteName },
            ]
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    GeneralService.showToastR({
                        body: `${aLanguage.saveSuccessful} comprobante: ${$scope.ReceiptName}`,
                        type: 'success'
                    });
                }
            }
        });
    }


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

    $scope.loadReceipt = function () {
        var dataSP = {
            "StoredProcedureName": "GetCodesReceipt",
            "StoredParams": []
        };

        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.codesReceipt = angular.copy(response.Value[0].DataMapped);
                }
            }
        });
    };

    $scope.loadCustomers = function () {
        var dataSP = {
            "StoredProcedureName": "GetCustomersForReceipt",
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
        let receiptName = typeof $scope.receiptName == 'undefined' ? '' : $scope.receiptName;
        let creationDate = $scope.document.fecha == null ? '' : $scope.document.fecha;

        if (creationDate == '' && receiptName == '' && customerId == '00000000-0000-0000-0000-000000000000') {
            GeneralService.showToastR({
                body: 'Seleccione al menos un parámetro para realizar la búsqueda',
                type: 'info'
            });
            return;
        }

        var dataSP = {
            "StoredProcedureName": "GetReceipt",
            "StoredParams": [
                { Name: "CustomerId", Value: customerId },
                { Name: "ReceiptName", Value: receiptName },
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
                        $scope.listRecepitGrid.api.setRowData([]);
                        GeneralService.showToastR({
                            body: aLanguage.NotFound,
                            type: 'info'
                        });
                    } else {
                        $scope.listRecepitGrid.api.setRowData(data);
                        GeneralService.showToastR({
                            body: aLanguage.RecordsLoaded,
                            type: 'success'
                        });
                    }
                }
            }
        });
    };

    $scope.loadSettings = function () {
        var dataSP = {
            "StoredProcedureName": "GetSettings",
            "StoredParams": []
        };

        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.settings = angular.copy(response.Value[0].DataMapped);
                }
            }
        });
    };

    $scope.loadAccountingReceiptTypes = function () {
        var dataSP = {
            "StoredProcedureName": "GetAccountingReceiptTypes",
            "StoredParams": []
        };

        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.accountingReceiptTypes = angular.copy(response.Value[0].DataMapped);
                }
            }
        });
    };
    //#endregion execute procedures

    //#region grid definition

    $scope.aLanguage = aLanguage;
    $scope.columnDefs = [
        {
            headerName: '',
            field: '',
            width: 60,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
            tooltipField: ''
        },
        { headerName: 'Comprobante', field: "ReceiptName", width: 180 },
        { headerName: 'Producto', field: "ProductName", width: 180 },
        { headerName: 'Cliente', field: "CustomerName", width: 180 },
        { headerName: 'Fecha elaboración', field: "CreationDate", width: 180, valueFormatter: shortDateFormat, },
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

    $scope.listRecepitGrid = {
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
        $scope.loadReceipt();
        $scope.loadProducts();
        $scope.loadSettings();
        $scope.loadAccountingReceiptTypes();
    };
    //#endregion init

    //#region helpers
    $scope.selectReceipt = function () {
        $scope.receiptSelected = $scope.codesReceipt.filter(x => x.CustomerId == $scope.CustomerId);
        if ($scope.receiptSelected.length === 0) {
            $scope.receiptName = '';
            GeneralService.showToastR({
                body: 'No se encontraron comprobantes asociados a este cliente',
                type: 'info'
            });
        }
    };

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


    function shortDateFormat(value) {
        return moment(value.data.CreationDate).format('YYYY/MM/DD')
    }
    //#endregion helpers
}