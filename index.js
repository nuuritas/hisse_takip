function createChart() {

  const sheetId = "1m1uhHHCcu3ts1V9EeStX08j5hZRlAWKaNNHAfTQCcs8";
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
  const columnData = data.values.slice(1).map(row => parseFloat(row[2].replace(',', '')));
  const lineData = data.values.slice(1).map(row => parseFloat(row[3].replace(',', '')));
  const pieData = data.values.slice(1).map(row => [row[0], parseFloat(row[6].replace(',', ''))]);
  
  // console.log(pieData);
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
      color: "purple"
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

function createTabs() {
  $('.nav-tabs a').click(function(){
    $(this).tab('show');
  });
  $('.nav-tabs a:first').tab('show');
}

function setCurrentDate() {
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('update-date').innerText = 'Güncellenme Tarihi: ' + dateString;
}

function total_money() {
  const sheetId = "1m1uhHHCcu3ts1V9EeStX08j5hZRlAWKaNNHAfTQCcs8";
  const range = "summary!g:g";
  const apiKey = "AIzaSyCrO9EFJztzVeVh6w8iqlV44VnlyC91_PA";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const total = data.values.slice(1).map(row => parseFloat(row[0].replace(',', '')));
      // console.log(total);
      const sum = total.reduce((a, b) => a + b, 0).toFixed(0);

  document.getElementById('total_money').innerText = 'Toplam Portföy: ' + sum + " ₺"
})
}

function fetchPortfolio() {
  const sheetId = "1m1uhHHCcu3ts1V9EeStX08j5hZRlAWKaNNHAfTQCcs8";
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
      Highcharts.chart('ts-container1', {
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
          },
          labels: {
            style: {
              color: '#fff'
            }
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

function fetchPortfolio2() {
  const sheetId = "1m1uhHHCcu3ts1V9EeStX08j5hZRlAWKaNNHAfTQCcs8";
  const range = "daily_port!a:m";
  const apiKey = "AIzaSyCrO9EFJztzVeVh6w8iqlV44VnlyC91_PA";
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // console.log(data.values);
      const today = new Date();
      // console.log(today);
      const todayString = today.toLocaleDateString('tr-TR');
      const dates = [];
      const prices0 = [];
      const prices1 = [];
      const prices2 = [];
      const prices3 = [];
      const prices4 = [];
      const prices5 = [];
      const prices6 = [];
      const prices7 = [];
      const prices8 = [];
      const prices9 = [];
      const prices10 = [];
      for (let i = 1; i < data.values.length; i++) {
        const row = data.values[i];
        const date = row[0];
        const price0 = parseFloat(row[row.length - 2].replace(',', ''));
        const price1 = parseFloat(row[row.length - 3].replace(',', ''));
        const price2 = parseFloat(row[row.length - 4].replace(',', ''));
        const price3 = parseFloat(row[row.length - 5].replace(',', ''));
        const price4 = parseFloat(row[row.length - 6].replace(',', ''));
        const price5 = parseFloat(row[row.length - 7].replace(',', ''));
        const price6 = parseFloat(row[row.length - 8].replace(',', ''));
        const price7 = parseFloat(row[row.length - 9].replace(',', ''));
        const price8 = parseFloat(row[row.length - 10].replace(',', ''));
        const price9 = parseFloat(row[row.length - 11].replace(',', ''));
        const price10 = parseFloat(row[row.length - 12].replace(',', ''));
        if (new Date(date) <= today) {
          dates.push(date);
          prices0.push(price0);
          prices1.push(price1);
          prices2.push(price2);
          prices3.push(price3);
          prices4.push(price4);
          prices5.push(price5);
          prices6.push(price6);
          prices7.push(price7);
          prices8.push(price8);
          prices9.push(price9);
          prices10.push(price10);
        }
      }
      
      // Create a time series chart
      Highcharts.chart('ts-container2', {
        chart: {
          type : 'area',
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
          },
          labels: {
            style: {
              color: '#fff'
            }
          }
        },
        legend: {
          enabled: true,
          itemStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>',
          shared: true
        },
        plotOptions: {
          area: {
              stacking: 'normal',
              lineColor: '#white',
              lineWidth: 1,
              marker: {
                  lineWidth: 2,
                  lineColor: '#666666'
              }
          }
      },
      colors : ['purple', 'olive', 
      'green', 'blue', 
      'gray', 'green', 
      'white', 'pink', 
      'military', 'darkred', '#ff0000'],

      series: [{name: 'TUPRS',data: prices0},
        {name: 'SISE',data: prices1},
        {name: 'SASA',data: prices2},
        {name: 'SAHOL',data: prices3},
        {name: 'KCHOL',data: prices4},
        {name: 'GARAN',data: prices5},
        {name: 'CFRSA',data: prices6},
        {name: 'ASELS',data: prices7},
        {name: 'ALCAR',data: prices8},
        {name: 'ALARK',data: prices9},
        {name: 'AKBNK',data: prices10}
        ]
      });
    })
    .catch(error => console.error(error));
}