angular.module(aLanguage.appName).controller('addCustomersController', ["$scope", '$rootScope', "$location", "GeneralService", addCustomersController]);
function addCustomersController($scope, $rootScope, $location, GeneralService) {
    $scope.listTypeIdentification = [];
    $scope.Customers = { id: "", type: "", person_type: "", id_type: "", identification: null, branch_office: 0, check_digit: null, name: "", comercial_name: "", active: 1, vat_responsible: 0, fiscal_responsibilities: "", addess: "", phone: "", contact: "", comments: "" };
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


    angular.element(document).ready(init);

    function init() {
        $scope.loadTypeIdentification();
    }

}