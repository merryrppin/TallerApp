agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('comprobantesController', ["$scope", '$rootScope', "$location", "GeneralService", comprobantesController]);
function comprobantesController($scope, $rootScope, $location, GeneralService) {

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
    $scope.wareHouses = [];
    $scope.settings = [];
    $scope.accountingReceiptTypes = [];
    //#endregion variables

    //#region comprobante
    function saveSiigoReceipt() {
        let items = []
        let creditValue = 0;
        $scope.listProductQuotationId = [];
        let ReceiptId = parseInt($scope.accountingReceiptTypes.find(x => x.Code == '13').Id);

        $scope.listQuotationGrid.api.forEachNode(function (row, node) {
            if (row.selected === true) {
                creditValue += parseFloat(row.data.ValorUnitario);
                $scope.listProductQuotationId.push({ 'ProductQuotationId': row.data.IdProductoCotizacion });
                items.push(
                    {
                        "account": {
                            "code": $scope.settings[0].CodeDebit,
                            "movement": "Debit"
                        },
                        "customer": {
                            "identification": $scope.settings[0].NIT,
                            "branch_office": "0"
                        },
                        "cost_center": [],
                        "description": row.data.DescripcionProducto,
                        "value": parseFloat(row.data.ValorUnitario)
                    },
                );
            }
        });

        items.push(
            {
                "account": {
                    "code": $scope.settings[0].CodeCredit,
                    "movement": "Credit"
                },
                "customer": {
                    "identification": $scope.settings[0].NIT,
                    "branch_office": "0"
                },
                "cost_center": [],
                "description": "Comprobante contable",
                "value": creditValue
            });

        let receipt =
        {
            "document": {
                "id": ReceiptId
            },
            "date": "2022-07-21",
            "items": items,
            "observations": "Comprobante contable"
        }

        let Receipt = angular.copy(GeneralService.userLogin);
        Receipt.Receipt = JSON.stringify(receipt);

        GeneralService.executeAjax({
            url: 'api/CreateReceipt',
            data: Receipt,
            success: function (response) {
                var result = JSON.parse(response);
                if (result) {
                    if (result.Errors) {
                        GeneralService.showToastR({
                            body: result.Errors[0].Code,
                            type: 'error'
                        });
                    } else {
                        saveReceipt(result);
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

    $scope.generateReceipt = function () {
        let isValidSelected = false;

        $scope.listQuotationGrid.api.forEachNode(function (row, node) {
            if (row.selected === true) {
                isValidSelected = true;
            }
        });

        if (!isValidSelected) {
            GeneralService.showToastR({
                body: 'Debes selecionar al menos una cotización',
                type: 'info'
            });
            return;
        }

        Swal.fire({
            title: aLanguage.WantSaveChanges,
            showDenyButton: true,
            confirmButtonText: 'Guardar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                saveSiigoReceipt();
                Swal.fire('Comprobante generado!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info')
            }
        })

    };

    function confirmSaveQuotationQuantity(event) {
        Swal.fire({
            title: aLanguage.WantSaveChanges,
            showDenyButton: true,
            confirmButtonText: 'Guardar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                updateQuotationQuantity(event.data);
                Swal.fire('Cambios guardados!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info')
                var changedData = [event.data];
                changedData[0].Cantidad = parseInt(event.oldValue);
                event.api.updateRowData({ update: changedData });
            }
        })
    };

    //#endregion comprobante

    //#region execute procedures
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

    function saveReceipt(resultSiigo) {
        $scope.ReceiptName = resultSiigo.name;
        var dataSP = {
            "StoredProcedureName": "SaveReceipt",
            "StoredParams": [
                { Name: "JsonProductQuotationId", Value: JSON.stringify($scope.listProductQuotationId) },
                { Name: "ReceiptId", Value: resultSiigo.id },
                { Name: "ReceiptName", Value: $scope.ReceiptName},
                { Name: "Username", Value: GeneralService.userLogin.UserCompleteName },
            ]
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    GeneralService.showToastR({
                        body: `${aLanguage.saveSuccessful } comprobante: ${$scope.ReceiptName}`,
                        type: 'success'
                    });
                }
            }
        });
    }


    $scope.loadWareHouses = function () {
        var dataSP = {
            "StoredProcedureName": "GetWareHouses",
            "StoredParams": []
        };

        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.wareHouses = angular.copy(response.Value[0].DataMapped);
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
            "StoredProcedureName": "GetCustomersTest",//TODO modificar a sp real
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

    $scope.SearchQuotation = function () {
        let customerId = typeof $scope.CustomerId == 'undefined' ? '00000000-0000-0000-0000-000000000000' : $scope.CustomerId;
        let quotationId = typeof $scope.IdCotizacion == 'undefined' ? -1 : $scope.IdCotizacion;
        let creationDate = typeof $scope.document.fecha == 'undefined' ? '' : $scope.document.fecha;



        var dataSP = {
            "StoredProcedureName": "GetQuotationForProof",
            "StoredParams": [
                { Name: "CustomerId", Value: customerId },
                { Name: "QuotationId", Value: quotationId == null ? -1 : quotationId },
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
                    $scope.SearchQuotation();
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
        {
            headerName: '',
            field: '',
            width: 60,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
            tooltipField: 'Click para editar cantidad'
        },
        { headerName: 'Nombre Producto', field: "name", width: 180 },
        { headerName: 'Cantidad', field: "Cantidad", width: 160, editable: true, singleClickEdit: true },
        { headerName: 'Cantidad Pendiente', field: "CantidadPendiente", width: 180 },
        { headerName: 'Valor Unitario', field: "ValorUnitario", width: 180 },
        { headerName: 'Total Producto', field: "TotalProducto", width: 180 },
        { headerName: 'Descuento Total', field: "DescuentoTotal", width: 180 }
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
        angularCompileRows: true,
        onCellValueChanged: function (event) {
            if (event.newValue !== event.oldValue) {
                if (validateQuantity(event.newValue)) {
                    confirmSaveQuotationQuantity(event);
                } else {
                    var changedData = [event.data];
                    changedData[0].Cantidad = parseInt(event.oldValue);
                    event.api.updateRowData({ update: changedData });
                }
            }
        }
    };

    //#endregion grid definition

    //#region init
    angular.element(document).ready(init);
    function init() {
        $scope.loadCustomers();
        $scope.loadQuotes();
        $scope.loadWareHouses();
        $scope.loadSettings();
        $scope.loadAccountingReceiptTypes();
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

    $scope.selectQuotes = function () {
        $scope.quoteSelected = $scope.quoteList.filter(x => x.CustomerId == $scope.CustomerId);
        if ($scope.quoteSelected.length === 0) {
            GeneralService.showToastR({
                body: aLanguage.NotQuotationFoundByClient,
                type: 'info'
            });
        }
    };
    //#endregion helpers
}