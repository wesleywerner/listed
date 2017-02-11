(function(){
    
  /**
   * The graph object gets merged into the Vue instance's methods property.
   */
  var graphs = {};
  
  // store generate chart instances
  Listed.charts = {};
  
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

    Listed.charts.mostChart = new Chart(ctx, {
        type: 'doughnut',
        data: dataObj,
        options: {
          onClick: function(evt, a) { 
            if (a.length == 1) {
              Listed.methods.loadItemHistoryChart(a[0]._view.label, a[0]._view.backgroundColor);
            }
          },
          title: {
            display: true,
            text: 'What I buy per month on average',
            fontSize: 30
          }
        }
    });
  }
  
  graphs.loadItemHistoryChart = function (text, color) {
    
    var ctx = "historyChart";
    var item = Listed.methods.findHistory(text);
    var frequency = Listed.methods.findPrediction(text).frequency;
    if (item == null) return;
    if (item.dates.length < 2) return;
    
    // data points match to all dates between history start and end.
    var data = [];
    var labels = [];
    var firstDate = moment(item.dates[0]);
    var lastDate = moment(item.dates.slice(-1)[0]);
    var totalMonths = Math.abs( firstDate.diff(lastDate, 'months') ) + 1;
    
    for (var i=0; i<=totalMonths; i++) {
      
      if (i > 0) firstDate.add(1, 'months');
      
      //var current = firstDate.format('YYYY-MM-DD');
      labels.push(firstDate.format('MMM YYYY'));
      
      var totalPurchases = item.dates.filter( function(purchaseDate) {
        var pd = moment(purchaseDate);
        return pd.month() == firstDate.month() && pd.year() == firstDate.year();
      }).length;
      
      data.push(totalPurchases);

    }
    
    var chartData = {
        labels: labels,
        datasets: [
            {
              label: text,
              backgroundColor: (new Array(totalMonths+1).fill(color)),
              borderColor: [],
              borderWidth: 1,
              data: data,
            }
        ]
    };
    
    if (Listed.charts.purchaseHistory != undefined) {
      Listed.charts.purchaseHistory.destroy();
    }
    
    Listed.charts.purchaseHistory = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          },
          title: {
            display: true,
            text: 'Purchase History per month',
            fontSize: 30
          }
        }
    });
    
    zenscroll.to(document.getElementById('historyChart'));

  }
  
  jQuery.extend(Listed.methods, graphs);
    
}())
