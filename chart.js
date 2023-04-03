function initializeDataTable() {
  return new Promise((resolve, reject) => {
    const startTime = new Date();

    $.ajax({
      url: 'https://j63o0nohm4.execute-api.eu-central-1.amazonaws.com/default/sql_summary',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        const rows = data.map(row => [row.hisse, row.num_of_tr, row.total_qt, row.avg_buy,
          row.cur_price, row.avg_pl, row.top_pl, row.cur_port]);
        const columns = ['Hisse', 'İşlem Sayısı', 'Toplam Miktar', 'Ort. Maliyet', 
          'Güncel Fiyat', 'Ort. K/Z', 'Toplam K/Z', 'Toplam Portföy'];

        const table = $('#data-table').DataTable({
          data: rows,
          columns: columns.map(header => ({ title: header })),
          paging: false,
          searching: false,
          info: false,
          lengthChange: false
        });
        table.draw();

        const categories = data.map(row => row.hisse);
        const columnData = data.map(row => parseFloat(row.avg_buy));
        const lineData = data.map(row => parseFloat(row.cur_price));
        const pieData = data.map(row => [row.hisse, parseFloat(row.cur_port)]);

        const endTime = new Date();
        console.log(`Time taken: ${endTime - startTime} ms`);

        resolve({ categories, columnData, lineData, pieData });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(`Error fetching data: ${textStatus}`);
        reject(errorThrown);
      }
    });
  });
}

$(document).ready(function() {
  if ($.fn.DataTable) {
    initializeDataTable();
  } else {
    console.log('DataTable not loaded yet');
    $.getScript('https://cdn.datatables.net/v/dt/dt-1.10.25/datatables.min.js', function() {
      console.log('DataTable loaded');
      initializeDataTable();
    }).fail(function() {
      console.error('Failed to load DataTables');
    });
  }
});


async function createChart() {
  try {
    const { categories, columnData, lineData, pieData } = await initializeDataTable();

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
        pointFormat: '<b>{point.y} ₺</b> ({point.percentage:.1f}%)'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y} ₺ ({point.percentage:.1f}%)',
            style: {
              color: '#fff',
              fontweight: 2
          }
        }
      }},
      series: [{
        name: 'Portföy (₺)',
        data: pieData
      }]
    });  
}
  catch (error) {
    console.error(error);
  }
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
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueRenderOption=UNFORMATTED_VALUE&key=${apiKey}`;

    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // console.log(data.values);
        const today = new Date();
        // console.log(today);
        const dates = [];
        const prices = [];
        for (let i = 1; i < data.values.length; i++) {
          const row = data.values[i];
          const date = row[0];
          const price = parseFloat(row[row.length - 1].replace(',', ''));
          if (new Date(date) <= today) {
            dates.push(date);
            prices.push(price);
          }
        }
        console.log("Port1 Data Fetched");
        // console.log(prices);
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
      
    const url = "https://3n8r5eyvsg.execute-api.eu-central-1.amazonaws.com/default/sql_port";

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const stocks = Object.keys(data[0]).filter(key => key !== "date" && key !== "Toplam");
        const dates = data.map(row => new Date(row.date).toLocaleDateString("tr-TR"));
        const prices = stocks.map(stock => data.map(row => row[stock]));

        console.log(stocks);
        
        console.log("Port2 Data Fetched");
        // console.log(prices10);
        // Create a time series chart
        Highcharts.chart('ts-container2', {
          chart: {
            type : 'area',
            backgroundColor: "transparent",
            zoomType: 'x'
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
        series: stocks.map((stock, i) => ({
          name: stock,
          data: prices[i],
          color: "#" + Math.floor(Math.random() * 16777215).toString(16)
        }))
        });
      })
      .catch(error => console.error(error));
}