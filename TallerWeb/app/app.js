(function () {
    angular.module(aLanguage.appName, [
        //'ngRoute',
        'ui.router',                        // Routing
        'oc.lazyLoad',                      // ocLazyLoad
        //'agGrid'                            // agGrid
    ]).run(function ($rootScope, $state, $injector) {
        //$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {            
        //    console.log(fromState);
        //    console.log(toState);
        //});
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (sessionStorage.restorestate == "true") {
                $rootScope.$broadcast('restorestate'); //let everything know we need to restore state
                sessionStorage.restorestate = false;
            }
        });

        //let everthing know that we need to save state now.
        window.onbeforeunload = function (event) {
            $rootScope.$broadcast('savestate');
        };
    });
})();