/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 */


(function(){
    
  /**
   * The graph object gets merged into the Vue instance's methods property.
   */
  var graphs = {};
  
  // store generate chart instances
  Shopt.charts = {};
  
  graphs.loadGraphs = function () {
    
    if (Shopt.data.prediction.length == 0) return;
    
    // Most Chart
    var ctx = "mostChart";
    
    var labels = Shopt.data.prediction.map( function(h) {
        return h.text;
    });
    
    var data = Shopt.data.prediction.map( function(h) {
        return Math.ceil(30 / h.frequency);
    });

    var dataObj = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    "#f44336", // red
                    "#b71c1c", // darken red
                    "#ffcdd2", // lighten red
                    "#e91e63", // pink
                    "#880e4f", // darken pink
                    "#f8bbd0", // lighten pink
                    "#9c27b0", // purple
                    "#4a148c", // darken purple
                    "#e1bee7", // lighten purple
                    "#673ab7", // deep purple
                    "#311b92", // darken deep purple
                    "#d1c4e9", // lighten deep purple
                    "#2196f3", // blue
                    "#0d47a1", // darken blue
                    "#bbdefb", // lighten blue
                    "#00bcd4", // cyan
                    "#006064", // darken cyan
                    "#009688", // teal
                    "#004d40", // darken teal
                    "#b2dfdb", // lighten teal
                    "#4caf50", // green
                    "#1b5e20", // darken green
                    "#c8e6c9", // lighten green
                    "#cddc39", // lime
                    "#827717", // darken lime
                    "#f0f4c3", // lighten lime
                    "#ffeb3b", // yellow
                    "#fff59d", // lighten yellow
                    "#ff9800", // orange
                    "#e65100", // darken orange
                    "#ffe0b2", // lighten orange
                    "#795548", // brown
                    "#3e2723", // darken brown
                    "#a1887f", // lighten brown
                    "#9e9e9e", // grey
                    "#212121", // darken grey
                    "#e0e0e0", // lighten grey 1
                    "#bdbdbd", // lighten grey 2
                    "#607d8b", // blue grey
                    "#263238", // darken blue grey
                    "#90a4ae" // lighten blue grey
                ],
                hoverBackgroundColor: [

                ]
            }]
    };

    Shopt.charts.mostChart = new Chart(ctx, {
        type: 'doughnut',
        data: dataObj,
        options: {
          onClick: function(evt, a) { 
            if (a.length == 1) {
              Shopt.methods.loadItemHistoryChart(a[0]._view.label, a[0]._view.backgroundColor);
            }
          },
          title: {
            display: true,
            text: 'Purchase Frequency',
            fontSize: 30
          }
        }
    });
  }
  
  graphs.loadItemHistoryChart = function (text, color) {
    
    var ctx = "historyChart";
    var item = Shopt.methods.findHistory(text);
    var frequency = Shopt.methods.findPrediction(text).frequency;
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
    
    if (Shopt.charts.purchaseHistory != undefined) {
      Shopt.charts.purchaseHistory.destroy();
    }
    
    Shopt.charts.purchaseHistory = new Chart(ctx, {
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
            text: 'Purchase History',
            fontSize: 30
          }
        }
    });
    
    zenscroll.to(document.getElementById('historyChart'));

  }
  
  jQuery.extend(Shopt.methods, graphs);
    
}())
