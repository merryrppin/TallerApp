agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module(aLanguage.appName, ["agGrid"]);
module.controller('comprobantesController', ["$scope", '$rootScope', "$location", "GeneralService", comprobantesController]);
function comprobantesController($scope, $rootScope, $location, GeneralService) {

    GeneralService.hideGeneralButtons();

    //#region variables
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
    $scope.customerList = [];
    $scope.quoteList = [];
    $scope.quoteSelected = [];
    //#endregion variables

    //#region comprobante
    $scope.comprobante = { document: { id: "" }, date: null, items: [], observations: "" };
    $scope.saveComprobante = function () {
        GeneralService.executeAjax({
            url: 'api/GetNumberCC',
            data: GeneralService.userLogin,
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

    $scope.selectQuotes = function () {
        $scope.quoteSelected = $scope.quoteList.filter(x => x.CustomerId == $scope.CustomerId);
        if ($scope.quoteSelected.length === 0) {
            GeneralService.showToastR({
                body: aLanguage.NotQuotationFoundByClient,
                type: 'info'
            });
        }
    };

    $scope.generateProof = function () {
        let items = []
        let isValidSelected = false;
        $scope.listQuotationGrid.api.forEachNode(function (row, node) {
            if (row.selected === true) {
                isValidSelected = true;
                items.push(
                    {
                        "account": {
                            "code": "14350101",//quemado
                            "movement": "Debit"//quemado
                        },
                        "customer": {
                            "identification": "109048401",//quemado
                            "branch_office": "0"//quemado
                        },
                        "cost_center": 233, //aplica si en la definicion esta marcado para uso,
                        "product": {
                            "code": row.data.code,
                            "warehouse": 19, //id bodega source
                            "quantity": row.data.CantidadPendiente
                        },
                        "description": row.data.DescripcionProducto,
                        "value": row.data.ValorUnitario
                    },
                    {
                        "account": {
                            "code": "11050501",//quemado
                            "movement": "Credit"//quemado
                        },
                        "customer": {
                            "identification": "109048401",//quemado
                            "branch_office": "0"//quemado
                        },

                        "product": {
                            "code": row.data.code,
                            "warehouse": 19, //id bodega destino
                            "quantity": row.data.CantidadPendiente
                        },

                        "description": row.data.DescripcionProducto, //Descripción opcional del credito
                        "cost_center": 233, //aplica si en la definicion esta marcado para uso,
                        "value": row.data.ValorUnitario
                    }
                );
            }
        });

        if (!isValidSelected) {
            GeneralService.showToastR({
                body: 'Debes selecionar al menos una cotización',
                type: 'info'
            });
            return;
        }

        let proof =
        {
            "document": {
                "id": 27441 //identificador de CC
            },
            "date": "2015-12-15",
            "items": items,
            "observations": "Observaciones"
        }
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
        $scope.loadProducts();
        $scope.loadCustomers();
        $scope.loadQuotes();
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