angular.module('ChartsCtrl', [])
.controller('ChartsController', ['$scope', '$http', 'googleChartApiPromise', function($scope, $http, googleChartApiPromise) {

    $http.get('/get').success(function(readings) {

        googleChartApiPromise.then(function() {
            var countersChart = new google.visualization.DataTable();
            countersChart.addColumn("string", "date");
            countersChart.addColumn("number", "temperature");
            countersChart.addColumn("number", "humidity");
            countersChart.addColumn("number", "light");

            countersChart.addRows(readings.length);
            for (var i=0; i<readings.length; i++) {
                var reading = readings[i];

                countersChart.setCell(i, 0, reading.date);
                countersChart.setCell(i, 1, reading.temp);
                countersChart.setCell(i, 2, reading.humidity.raw);
                countersChart.setCell(i, 3, reading.light.raw);
            }

            $scope.countersChart = {
                type: 'LineChart',
                data: countersChart,
                options: {backgroundColor: '#FAFAFA', height: 500, legend: {position: 'top', maxLines: 3}, chartArea: {left: 0, width: '100%', height: '70%'}}
            };

        });
    });


}]);