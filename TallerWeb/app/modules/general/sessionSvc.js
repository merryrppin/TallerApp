angular.module(aLanguage.appName).factory('SessionService', ['$rootScope', SessionService]);
function SessionService($rootScope) {

    var sessionService = {

        model: {
            name: '',
            email: '',
            userSession: '',
            company: {}
        },

        SaveState: function () {
            if (typeof sessionService.model !== 'undefined' && sessionService.model != null)
                sessionStorage.sessionService = angular.toJson(sessionService.model);
        },

        RestoreState: function () {
            if (typeof sessionStorage.sessionService !== 'undefined')
                sessionService.model = angular.fromJson(sessionStorage.sessionService);
        },

        ClearState: function () {
            sessionStorage.sessionService = null;
            sessionService.model = null;
        }
    }

    $rootScope.$on("savestate", sessionService.SaveState);
    $rootScope.$on("restorestate", sessionService.RestoreState);
    $rootScope.$on("clearState", sessionService.ClearState);

    return sessionService;
}