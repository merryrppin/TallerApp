angular.module(aLanguage.appName).controller('addCustomersController', ["$scope", '$rootScope', "$location", "GeneralService", addCustomersController]);
function addCustomersController($scope, $rootScope, $location, GeneralService) {
    $rootScope.showSaveButton = true;
    $scope.listTypeIdentification = [];
    $scope.listFiscal = [];
    $scope.listCities = [];
    $scope.phones = {indicative:"",number:"",extension:""}
    $scope.contact = { first_name: "", last_name: "", email: "", phone: $scope.phones}
    $scope.address = {address:"",city:null,postal_code:""}
    $scope.Customers = { id: "", type: "Customer", person_type: "", id_type: "", identification: null, branch_office: 0, check_digit: "", name: "", commercial_name: "", active: "true", vat_responsible: "true", fiscal_responsibilities: "", address: "", phones: [$scope.phones], contacts: "", comments: "" };
    $scope.loadTypeIdentification = function () {
        var dataSP = {
            "StoredProcedureName": "GetTypeIdentification",
            "StoredParams": []
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.listTypeIdentification = response.Value[0].DataMapped;
                }
            }
        });
    };
    $scope.loadFiscalResposabilities = function () {
        var dataSP = {
            "StoredProcedureName": "GetFiscalResponsabilities",
            "StoredParams": []
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.listFiscal = response.Value[0].DataMapped;
                    $scope.listFiscal.forEach(x => { Selected: false });
                }
            }
        });
    };

    $scope.loadcities = function () {
        var dataSP = {
            "StoredProcedureName": "GetCities",
            "StoredParams": []
        };
        GeneralService.executeAjax({
            url: 'api/executeStoredProcedure',
            data: dataSP,
            success: function (response) {
                if (response.Exception === null) {
                    $scope.listCities = response.Value[0].DataMapped;
                }
            }
        });
    };

    $scope.checkDigit = function calcularDigitoVerificacion() {
        $scope.Customers.identification = $scope.Customers.identification.replace(/\s/g, "")
        var vpri,
            x,
            y,
            z;

        // Se limpia el Nit
        $scope.Customers.identification = $scope.Customers.identification.replace(/\s/g, ""); // Espacios
        $scope.Customers.identification = $scope.Customers.identification.replace(/,/g, ""); // Comas
        $scope.Customers.identification = $scope.Customers.identification.replace(/\./g, ""); // Puntos
        $scope.Customers.identification = $scope.Customers.identification.replace(/-/g, ""); // Guiones

        // Se valida el nit
        if (isNaN($scope.Customers.identification)) {
            console.log("El nit/cédula '" + $scope.Customers.identification + "' no es válido(a).");
            return "";
        };

        // Procedimiento
        vpri = new Array(16);
        z = $scope.Customers.identification.length;

        vpri[1] = 3;
        vpri[2] = 7;
        vpri[3] = 13;
        vpri[4] = 17;
        vpri[5] = 19;
        vpri[6] = 23;
        vpri[7] = 29;
        vpri[8] = 37;
        vpri[9] = 41;
        vpri[10] = 43;
        vpri[11] = 47;
        vpri[12] = 53;
        vpri[13] = 59;
        vpri[14] = 67;
        vpri[15] = 71;

        x = 0;
        y = 0;
        for (var i = 0; i < z; i++) {
            y = ($scope.Customers.identification.substr(i, 1));
            // console.log ( y + "x" + vpri[z-i] + ":" ) ;

            x += (y * vpri[z - i]);
            // console.log ( x ) ;    
        }

        y = x % 11;
        // console.log ( y ) ;

        $scope.Customers.check_digit = (y > 1) ? 11 - y : y;
    }

    $rootScope.saveBtnFunction = function () {
        if ($scope.address && $scope.selectedCities.originalObject && $scope.Customers.check_digit && $scope.Customers.id_type && $scope.Customers.identification && $scope.contact.first_name && $scope.contact.last_name && $scope.Customers.person_type) {
            $scope.saveCustomer();
        }
        else {
            GeneralService.showToastR({
                body: "Por favor diligencie el formulario completo.",
                type: 'error'
            });
        }
        
    };
    $scope.saveCustomer = function () {
        $scope.Customers.check_digit = $scope.Customers.check_digit.toString();
        $scope.Customers.name = [$scope.contact.first_name, $scope.contact.last_name];
        $scope.Customers.commercial_name = $scope.contact.first_name+" "+ $scope.contact.last_name
        $scope.address.city = $scope.selectedCities.originalObject;
        $scope.Customers.contacts = [$scope.contact];
        $scope.Customers.address = $scope.address
        $scope.Customers.fiscal_responsibilities = $scope.listFiscal.filter(x => x.Selected == true);
        var Customers = angular.copy(GeneralService.userLogin);
        Customers.Customers = JSON.stringify($scope.Customers);

        GeneralService.executeAjax({
            url: 'api/CreateCustomer',
            data: Customers ,
            success: function (response) {
                var result = JSON.parse(response);
                if (result) {
                    if (result.Errors) {
                        GeneralService.showToastR({
                            body: result.Errors[0].Code,
                            type: 'error'
                        });
                    }
                    else {
                        GeneralService.showToastR({
                            body: "El Cliente se guardo satisfactoriamente en SIIGO",
                            type: 'error'
                        });
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
    angular.element(document).ready(init);

    function init() {
        $scope.loadTypeIdentification();
        $scope.loadFiscalResposabilities();
        $scope.loadcities();

    }

}