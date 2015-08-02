angular.module('ChartsCtrl', [])
.controller('ChartsController', ['$scope', '$http', 'googleChartApiPromise', function($scope, $http, googleChartApiPromise) {

    googleChartApiPromise.then(function() {
        var countersChart = new google.visualization.DataTable();
        countersChart.addColumn("string", "date");
        countersChart.addColumn("number", "temperature");
        countersChart.addColumn("number", "humidity");
        countersChart.addColumn("number", "light");

        countersChart.addRows(2);
        countersChart.setCell(0, 1, '08/05/1985');
        countersChart.setCell(0, 2, 180);
        countersChart.setCell(0, 3, 30);
        countersChart.setCell(0, 4, 30);
        countersChart.setCell(1, 1, '07/07/1986');
        countersChart.setCell(1, 2, 180);
        countersChart.setCell(1, 3, 30);
        countersChart.setCell(1, 4, 30);

        $scope.countersChart = {
            type: 'LineChart',
            data: countersChart,
            options: {backgroundColor: '#FAFAFA', height: 500, legend: {position: 'top', maxLines: 3}, chartArea: {left: 0, width: '100%', height: '70%'}}
        };

    });

}]);