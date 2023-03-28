function createChart() {

  const sheetId = "1Hgec6ktnrIAqXL90cVrTsn5rOS9cHI6KnerQ9Lc3kt0";
  const range = "summary!a1:g12";
  const apiKey = "AIzaSyCrO9EFJztzVeVh6w8iqlV44VnlyC91_PA";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // console.log(data.values);
      const table = $('#data-table').DataTable({
        data: data.values.slice(1),
        columns: data.values[0].map(header => ({ title: header })),
        paging: false,
        searching : false,
        info: false,
        lengthChange: false
      });
      // initialize DataTable with table object
      table.draw();
  
  
  const categories = data.values.slice(1).map(row => row[0]);
  const columnData = data.values.slice(1).map(row => parseFloat(row[2].replace(',', '.')));
  const lineData = data.values.slice(1).map(row => parseFloat(row[3].replace(',', '.')));
  const pieData = data.values.slice(1).map(row => [row[0], parseFloat(row[6].replace(',', '.'))]);
  
  console.log(pieData);
  // Create the column chart using Highcharts
  Highcharts.chart('chart-container', {
    chart: {
      type: 'column',
      backgroundColor: "transparent",
    },
    title: {
      text: 'Ortalama Maliyet',
      style: {
        color: '#fff'
      }
    },
    xAxis: {
      categories: categories,
      title: {
        style: {
          color: '#fff'
        }
      },
      labels: {
        style: {
          color: '#fff'
        }
      }
    },
    yAxis: [{
      title: {
        text: 'Ort. Maliyet',
        style: {
          color: '#fff'
        }
      },
      labels: {
        style: {
          color: '#fff'
        }
      }
    }, {
      title: {
        text: 'Güncel Fiyat',
        style: {
          color: '#fff'
        }
      },
      labels: {
        style: {
          color: '#fff'
        }
      },
      opposite: true
    }],
    legend: {
      itemStyle: {
        color: '#fff'
      }
    },    
    series: [{
      name: 'Ort. Maliyet',
      data: columnData,
      color: "olive"
    }, {
      name: 'Güncel Fiyat',
      type: 'line',
      yAxis: 1,
      data: lineData,
      color: '#5271FF'
    }]
  });
  
  
  // Create the pie chart using Highcharts
  Highcharts.chart('pie-chart-container', {
    chart: {
      type: 'pie',
      backgroundColor: "transparent"
    },
    title: {
      text: 'Portföy Dağılımı'
    },
    tooltip: {
      pointFormat: '<b>{point.y} bin₺</b> ({point.percentage:.1f}%)'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y} bin₺ ({point.percentage:.1f}%)',
          style: {
            color: '#fff',
            fontweight: 2
        }
      }
    }},
    series: [{
      name: 'Portföy (bin₺)',
      data: pieData
    }]
  });  
    })
}

function fetchPortfolio() {
  const sheetId = "1Hgec6ktnrIAqXL90cVrTsn5rOS9cHI6KnerQ9Lc3kt0";
  const range = "daily_port!a:m";
  const apiKey = "AIzaSyCrO9EFJztzVeVh6w8iqlV44VnlyC91_PA";
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // console.log(data.values);
      const today = new Date();
      console.log(today);
      const todayString = today.toLocaleDateString('tr-TR');
      const dates = [];
      const prices = [];
      for (let i = 1; i < data.values.length; i++) {
        const row = data.values[i];
        const date = row[0];
        const price = parseFloat(row[row.length - 1].replace(',', '.'));
        if (new Date(date) <= today) {
          dates.push(date);
          prices.push(price);
        }
      }
      console.log(dates);
      // Create a time series chart
      Highcharts.chart('ts-container', {
        chart: {
          zoomType: 'x',
          backgroundColor: "transparent"
        },
        title: {
          text: 'Günlük Portföy Değeri'
        },
        xAxis: {
          categories: dates,
          type: 'datetime',
          labels: {
            style: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          title: {
            text: 'Toplam (₺)'
          }
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          area: {
              fillColor: {
                  linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1
                  },
                  stops: [
                      [0, Highcharts.getOptions().colors[0]],
                      [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                  ]
              },
              marker: {
                  radius: 2
              },
              lineWidth: 1,
              states: {
                  hover: {
                      lineWidth: 1
                  }
              },
              threshold: null
          }
        },
        series: [{
          type : 'area',
          name: 'Portfolyo',
          data: prices
        }]
      });
    })
    .catch(error => console.error(error));
}

function createTabs() {
  $('.nav-tabs a').click(function(){
    $(this).tab('show');
  });
  $('.nav-tabs a:first').tab('show');
}