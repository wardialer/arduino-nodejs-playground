angular.module('ChartsCtrl', [])
.controller('ChartsController', ['$scope', '$http', 'googleChartApiPromise' function($scope, $http, googleChartApiPromise) {

    googleChartApiPromise.then(function() {
        var countersChart = new google.visualization.DataTable();
        countersChart.addColumn("string", "label");
        countersChart.addColumn("number", "elementi totali");
        countersChart.addColumn("number", "geolocalizzati");
        countersChart.addColumn("number", "multimediali");

        countersChart.addRows(1);
        countersChart.setCell(0, 1, 150);
        countersChart.setCell(0, 2, 180);
        countersChart.setCell(0, 3, 30);

        $scope.countersChart = {
            type: 'BarChart',
            data: countersChart,
            options: {backgroundColor: '#FAFAFA', height: 500, legend: {position: 'top', maxLines: 3}, chartArea: {left: 0, width: '100%', height: '70%'}}
        };

    });

}]);