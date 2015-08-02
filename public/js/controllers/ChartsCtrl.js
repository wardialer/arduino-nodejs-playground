angular.module('ChartsCtrl', [])
.controller('ChartsController', ['$scope', '$http', 'googleChartApiPromise', function($scope, $http, googleChartApiPromise) {

    $http.get('/get').success(function(readings) {

        googleChartApiPromise.then(function() {
            var countersChart = new google.visualization.DataTable();
            countersChart.addColumn("string", "Date");
            countersChart.addColumn("number", "Temperature (°C)");
            countersChart.addColumn("number", "Humidity (scaled)");
            countersChart.addColumn("number", "Light (scaled)");

            countersChart.addRows(readings.length);
            for (var i=0; i<readings.length; i++) {
                var reading = readings[i];

                countersChart.setCell(i, 0, reading.date);
                countersChart.setCell(i, 1, reading.temp);
                countersChart.setCell(i, 2, reading.humidity.scaled);
                countersChart.setCell(i, 3, reading.light.scaled);
            }

            $scope.countersChart = {
                type: 'LineChart',
                data: countersChart,
                options: {
                    title: 'Sensors',
                    height: 500, 
                    vAxis: {
                        minValue: 0,
                        gridlines: {count: 5}
                    },
                    legend: {
                        position: 'top', 
                        maxLines: 3
                    } 
                }
            };

        });
    });


}]);