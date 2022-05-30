function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/404");
    $ocLazyLoadProvider.config({
        //debug: true
    });
    $stateProvider
        .state('login', {
            url: "/login",
            //templateUrl: "app/modules/general/login/Login.html",
            controller: "loginController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/login/loginCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('home', {
            url: "/home",
            templateUrl: "app/modules/general/home/home.html",
            controller: "homeController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/home/homeCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('listUsers', {
            url: "/listUsers",
            templateUrl: "app/modules/general/user/listUsers.html",
            controller: "listUsersController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/user/listUsersCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('addUser', {
            url: "/addUser",
            templateUrl: "app/modules/general/user/addUser.html",
            controller: "addUserController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/user/addUserCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('listWarehouse', {
            url: "/listWarehouse",
            templateUrl: "app/modules/general/warehouse/listWarehouse.html",
            controller: "listWarehouseController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/warehouse/listWarehouseCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('addWarehouse', {
            url: "/addWarehouse",
            templateUrl: "app/modules/general/warehouse/addWarehouse.html",
            controller: "addWarehouseController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/warehouse/addWarehouseCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('addSaleInvoice', {
            url: "/addSaleInvoice",
            templateUrl: "app/modules/sales/saleInvoice/addSaleInvoice.html",
            controller: "addSaleInvoiceController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/sales/saleInvoice/addSaleInvoiceCtrl.js',
                            'app/modules/sales/saleInvoice/addSaleInvoice.css'
                        ]
                    });
                }]
            }
        })
        .state('listSeries', {
            url: "/listSeries",
            templateUrl: "app/modules/general/Series/listSeries.html",
            controller: "listSeriesController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/Series/listSeriesCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('addSeries', {
            url: "/addSeries",
            templateUrl: "app/modules/general/Series/addSeries.html",
            controller: "addSerieController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/Series/addSeriesCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('priceList', {
            url: "/priceList",
            templateUrl: "app/modules/sales/priceList/priceList.html",
            controller: "priceListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/sales/priceList/priceListCtrl.js',
                            'app/modules/sales/priceList/priceList.css'
                        ]
                    });
                }]
            }
        })
        .state('listProducts', {
            url: "/listProducts",
            templateUrl: "app/modules/general/products/listProducts.html",
            controller: "listProductsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/products/listProductsCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('addCustomers', {
            url: "/addCustomers",
            templateUrl: "app/modules/general/customers/addCustomers.html",
            controller: "addCustomersController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/customers/customersCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('cotizaciones', {
            url: "/cotizaciones",
            templateUrl: "app/modules/transacciones/cotizaciones/cotizaciones.html",
            controller: "cotizacionesController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/transacciones/cotizaciones/cotizacionesCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('listCotizaciones', {
            url: "/listCotizaciones",
            templateUrl: "app/modules/transacciones/cotizaciones/listCotizaciones.html",
            controller: "listCotizacionesController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/transacciones/cotizaciones/listCotizacionesCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('recepcionProductos', {
            url: "/recepcionProductos",
            templateUrl: "app/modules/general/products/recepcionProductos.html",
            controller: "recepcionProductoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/products/recepcionProductosCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('listRecepcionProductos', {
            url: "/listRecepcionProductos",
            templateUrl: "app/modules/general/products/listRecepcionProductos.html",
            controller: "listRecepcionProductosController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: aLanguage.appName,
                        files: [
                            'app/modules/general/products/listRecepcionProductoCtrl.js'
                        ]
                    });
                }]
            }
        })
        .state('404', {
            url: "/404",
            templateUrl: "app/modules/general/error/404.html",
            controller: "errorController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    var url = "Pages/Error/404.html";
                    window.location.replace(url);
                }]
            }
        });
}

angular.module(aLanguage.appName).config(config)
    .run(function ($rootScope, $state) {
        //$rootScope.aLanguage = aLanguage;
    });