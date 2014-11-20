define(function (require) {
  require('css!plugins/logsearch-status/styles/main.css');

  var app = require('modules').get('app/logsearch-status', [
    'elasticsearch',
    'ngRoute'
  ]);

  require('routes')
  .when('/logsearch-status', {
    template: require('text!plugins/logsearch-status/index.html')
  });

  app.directive('logsearchStatusApp', function () {
    return {
      controller: function ($scope, $http) {
        $http.post(
          'elasticsearch/.component-status/_search',
          {
              "aggs" : {
                  "children" : {
                      "terms" : { "field" : "environment", "size": 0 },
                      "aggs" : {
                          "children" : {
                              "terms" : { "field" : "cluster", "size": 0 },
                              "aggs" : {
                                  "children" : {
                                      "terms" : { "field" : "host", "size": 0 },
                                      "aggs" : {
                                          "children" : {
                                              "terms" : { "field" : "service", "size": 0 },
                                              "aggs" : {
                                                  "event_source" : {
                                                      "terms" : { "field" : "event_source", "size": 0}
                                                  }
                                              }
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              },
             "size": 0
          }
        ).
          success(function(data, status, headers, config) {
            $scope.componentstatus = data;
          }).
          error(function(data, status, headers, config) {
            console.error(data);
          });
      }
    };
  });

  var apps = require('registry/apps');
  apps.register(function () {
    return {
      id: 'logsearch-status',
      name: 'Status',
      order: 3
    };
  });
});
