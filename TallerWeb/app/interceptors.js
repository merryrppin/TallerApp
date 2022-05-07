//Interceptor que valida si esta autenticado y  si la respuesta es 401 para redireccionar al login
angular.module(aLanguage.appName).factory('AutenticacionInterceptor', ["$q", "$location", "$rootScope",
    function ($q, $location) {
        var autenticacionInterceptor = {};

        var responseError = function (rejection) {
            //if (rejection.status === 401) {//Cuando no esta autorizado
            //    //$location.path("/login");
            //    $location.path("/home");
            //}
            //if (rejection.status <= 0) {//Cuando no hay conexion                
            //    $location.path("/404");
            //}

            var deferred = $q.defer();
        };

        autenticacionInterceptor.responseError = responseError;
        return autenticacionInterceptor;
    }
]);

//Inyecto los interceptors en la aplicacion
angular.module(aLanguage.appName).config(function ($httpProvider) {
    $httpProvider.interceptors.push("AutenticacionInterceptor");
});