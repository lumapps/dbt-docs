
const angular = require('angular');

const templates = {
    main: require('./main/main.html'),
    overview: require('./overview/overview.html'),

    model: require('./docs/model.html'),
    metric: require('./docs/metric.html'),
}

angular
.module('dbt')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    var graph_params = 'g_v&g_i&g_e&g_p&g_n';

    $urlRouterProvider.otherwise('/overview');
    $stateProvider
        .state('dbt', {
            url: '/',
            abstract: true,
            controller: 'MainController',
            templateUrl: templates.main
        })
        .state('dbt.overview', {
            url: 'overview?' + graph_params,
            controller: 'OverviewCtrl',
            templateUrl: templates.overview,
        })
        .state('dbt.project_overview', {
            url: 'overview/:project_name?' + graph_params,
            controller: 'OverviewCtrl',
            templateUrl: templates.overview,
            params: {
                project_name: {type: 'string'}
            }
        })
        .state('dbt.model', {
            url: 'model/:unique_id?section&' + graph_params,
            controller: 'ModelCtrl',
            templateUrl: templates.model,
            params: {
                unique_id: {type: 'string'}
            },
        })
        .state('dbt.snapshot', {
            url: 'snapshot/:unique_id?section&' + graph_params,
            controller: 'SnapshotCtrl',
            templateUrl: templates.snapshot,
            params: {
                unique_id: {type: 'string'}
            },
        })
        .state('dbt.metric', {
            url: 'metric/:unique_id?section&' + graph_params,
            controller: 'MetricCtrl',
            templateUrl: templates.metric,
            params: {
                unique_id: {type: 'string'}
            },
        })
}])
