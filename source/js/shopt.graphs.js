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
    
    // create a color palette based on the current flavour.
    // map each flavour to it's base color
    var baseColors = {
      'red': '#f44336',
      'pink': '#e91e63',
      'purple': '#9c27b0',
      'indigo': '#3f51b5',
      'cyan': '#00bcd4',
      'green': '#4caf50',
      'lime': '#cddc39',
      'amber': '#ffc107',
      'deep-orange': '#ff5722',
      'brown': '#2196f3',
      'grey': '#2196f3'
      }

    var palette = net.brehaut.Color(baseColors[Shopt.data.color] || baseColors['red']);
    var backgroundColor = [];
    var flip = false;
    for(i=1; i<data.length+1; i++) {
      if (flip) 
        backgroundColor.push(palette.darkenByRatio(0.5).toCSS());
      else
        backgroundColor.push(palette.toCSS());
      palette = palette.shiftHue(24);
      // flip the palette affter n iterations for more variation
      if (i%15==0) flip = !flip;
    }

    var dataObj = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: backgroundColor,
                hoverBackgroundColor: [ ]
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

  // hook into native android back-button events.
  // returns true if the back button was handled here.
  Shopt.methods.backButton = function() {

    var openModal = $('#helpModal').hasClass('open');
    if (openModal) {
       $('#helpModal').modal('close');
      return true;
    }

    // navigate to the main page
    window.location = 'index.html'
    return true;
    
  }

}())
