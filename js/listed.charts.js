(function(){
    
  /**
   * The ui object gets merged into the Vue instance's methods property.
   */
  var graphs = {};
  
  graphs.loadGraphs = function () {
    
    // Most Chart
    var ctx = "mostChart";
    
    var labels = Listed.data.prediction.map( function(h) {
        return h.text;
    });
    
    var data = Listed.data.prediction.map( function(h) {
        return Math.ceil(30 / h.frequency);
    });

    var dataObj = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    "#f44336", // red
                    "#e91e63", // pink
                    "#9c27b0", // purple
                    "#673ab7", // deep purple
                    "#3f51b5", // indigo
                    "#2196f3", // blue
                    "#00bcd4", // cyan
                    "#009688", // teal
                    "#4caf50", // green
                    "#cddc39", // lime
                    "#ffeb3b", // yellow
                    "#ff9800", // orange
                    "#795548", // brown
                    "#9e9e9e", // grey
                    "#607d8b" // blue grey
                ],
                hoverBackgroundColor: [

                ]
            }]
    };

    var mostChart = new Chart(ctx, {
        type: 'doughnut',
        data: dataObj,
        options: {

        }
    });
  }
  
  jQuery.extend(Listed.methods, graphs);
    
}())