chrome.devtools.network.onRequestFinished.addListener(request => {
  request.getContent((body) => {
    if (request.request && request.request.url) {
      if (request.request.url.includes('/api/v1/portfolio/stats/symphony')) {
        chrome.runtime.sendMessage({
            response: body
        });
	if(body != null){
		//createDynamic(body);
	}
	
      }
    }
  });
});

const jsonData = {
  "JJeCo7c8hPiFMXKhDmlX": {
    "annualized_rate_of_return": 3.077834896173524,
    "value": 51.90405577044,
    "sharpe_ratio": 3.933443185149557,
    "deposit_adjusted_value": 51.90405577044001,
    "max_drawdown": 0.022780688587664084,
    "net_deposits": 50,
    "holdings": [
      {
        "ticker": "USD",
        "current_price": null,
        "percent_change": null,
        "amount": 0.0,
        "value": 1.03,
        "current_allocation": 0.02
      },
      {
        "ticker": "MSTR",
        "amount": 0.168078683,
        "percent_change": null,
        "current_price": 302.68,
        "value": 50.87405577044,
        "current_allocation": 0.98
      }
    ],
    "todays_percent_change": -0.00440518568311477,
    "todays_dollar_change": -0.22965869256000104
  },
  "c3j0jkjw0DwRWpOxMpQd": {
    "annualized_rate_of_return": 0.14765648222393457,
    "value": 52.17765699484,
    "sharpe_ratio": 0.9971755153004371,
    "deposit_adjusted_value": 52.17765699484001,
    "max_drawdown": 0.018372787790632207,
    "net_deposits": 50,
    "holdings": [
      {
        "ticker": "USD",
        "current_price": null,
        "percent_change": null,
        "amount": 0.0,
        "value": 1.13,
        "current_allocation": 0.022
      },
      {
        "ticker": "BTAL",
        "amount": 0.607504466,
        "percent_change": null,
        "current_price": 19.54,
        "value": 11.87063726564,
        "current_allocation": 0.228
      },
      {
        "ticker": "DBC",
        "amount": 0.536418616,
        "percent_change": null,
        "current_price": 22.7,
        "value": 12.1767025832,
        "current_allocation": 0.233
      },
      {
        "ticker": "FAS",
        "amount": 0.214586255,
        "percent_change": null,
        "current_price": 59.1,
        "value": 12.6820476705,
        "current_allocation": 0.243
      },
      {
        "ticker": "TMF",
        "amount": 1.847518642,
        "percent_change": 1,
        "current_price": 7.75,
        "value": 14.3182694755,
        "current_allocation": 0.274
      }
    ],
    "todays_percent_change": 0.04096966321873031,
    "todays_dollar_change": 2.0535670828399972
  },
  "x1": {
    "annualized_rate_of_return": 0.14765648222393457,
    "value": 52.17765699484,
    "sharpe_ratio": 0.9971755153004371,
    "deposit_adjusted_value": 52.17765699484001,
    "max_drawdown": 0.018372787790632207,
    "net_deposits": 50,
    "holdings": [
      {
        "ticker": "USD",
        "current_price": null,
        "percent_change": null,
        "amount": 0.0,
        "value": 1.13,
        "current_allocation": 0.022
      },
      {
        "ticker": "BTAL",
        "amount": 0.607504466,
        "percent_change": null,
        "current_price": 19.54,
        "value": 11.87063726564,
        "current_allocation": 0.228
      },
      {
        "ticker": "DBC",
        "amount": 0.536418616,
        "percent_change": null,
        "current_price": 22.7,
        "value": 12.1767025832,
        "current_allocation": 0.233
      },
      {
        "ticker": "FAS",
        "amount": 0.214586255,
        "percent_change": null,
        "current_price": 59.1,
        "value": 12.6820476705,
        "current_allocation": 0.243
      },
      {
        "ticker": "TMF",
        "amount": 1.847518642,
        "percent_change": 1,
        "current_price": 7.75,
        "value": 14.3182694755,
        "current_allocation": 0.274
      }
    ],
    "todays_percent_change": 0.04096966321873031,
    "todays_dollar_change": 2.0535670828399972
  }
};
function createDynamic(data) {
  //Allow columns to be sorted
  const columnDefs = [
    { field: "ticker", headerName: "Ticker", width: 100,      sortable: true,filter: true   },
    { field: "amount", headerName: "Amount", width: 100,      sortable: true,filter: "agNumberColumnFilter", type: "numeric" },
    { field: "percent_change", headerName: "Percentage Change", width: 150, sortable: true, filter: "agNumberColumnFilter",  type: "numeric",
    cellRenderer: function(params) {
     
      if (params.value === null) {
        return;
      }
      const value = parseFloat(params.value);
      
      const formattedValue = value >= 0 ? '+' + value.toFixed(2) + '%' : "-"+value.toFixed(2) + '%';
      const color = value >= 0 ? 'green' : 'red';
      return `<span style="color: ${color}">${formattedValue}</span>`;
    }
    },
    { field: "current_price", headerName: "Current Price", width: 120,sortable: true,filter: "agNumberColumnFilter", type: "numeric" },
    { field: "value", headerName: "Value", width: 100, sortable: true,filter: "agNumberColumnFilter", type: "numeric",
  
    //show dollar sign ahead of the value
    cellRenderer: function(params) {
      return '$' + params.value.toFixed(2);

    },
  },
    { field: "current_allocation", headerName: "Current Allocation", width: 150, sortable: true,filter: "agNumberColumnFilter", type: "numeric",
    //Convert value to percentage and show percentage sign after value
    cellRenderer: function(params) {
      return (params.value * 100).toFixed(2) + '%';
     }
    }
    
  ];

  const portfolioData = Object.values(jsonData);
  const rowData = portfolioData.flatMap(item => item.holdings);

  const gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      resizable: true
    }
  };

  const gridDiv = document.querySelector("#gridContainer");
  new agGrid.Grid(gridDiv, gridOptions);
}

////////////////pie chart..

/*const holdingsData = Object.values(jsonData).map(portfolio => portfolio.holdings);

// Create an array of labels and an array of values for each holding
const labels = [];
const values = [];

holdingsData.forEach(holdings => {
  holdings.forEach(holding => {
    labels.push(holding.ticker);
    values.push(holding.current_allocation);
  });
});

const colors = holdingsData.flat().map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));


// Generate random colors for the pie slices

// Create the pie chart
new Chart(document.getElementById('portfolioChart'), {
  type: 'pie',
  data: {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: colors
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Portfolio Allocations'
    }
  }
});*/

// Iterate over each portfolio and generate a pie chart for each holdings array
Object.values(jsonData).forEach(portfolio => {
  const holdings = portfolio.holdings;
  const labels = holdings.map(holding => holding.ticker);
  const values = holdings.map(holding => (holding.current_allocation * 100) );

  // Generate random colors for the pie slices
  const colors = holdings.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));

  // Create a unique ID for each chart container
  const chartContainerId = `portfolioChart_${portfolio.id}`;

  // Create a new chart container element
  const chartContainer = document.createElement('div');
  chartContainer.classList.add('chart-container');
  chartContainer.id = chartContainerId;
  chartContainer.style.width = '400px'; // Set the desired width
  chartContainer.style.height = '300px'; // Set the desired height
  document.body.appendChild(chartContainer);

  // Create a canvas element inside the chart container
  const canvas = document.createElement('canvas');
  canvas.width = 40; // Set the desired width
  canvas.height = 30; // Set the desired height
  chartContainer.appendChild(canvas);

  // Create the pie chart
  new Chart(canvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true, // Enable responsiveness
      maintainAspectRatio: false, // Disable aspect ratio
      title: {
        display: true,
        text: 'Portfolio Allocations'
      },
      plugins: {
        datalabels: {
          color: '#fff',
          formatter: (value, context) => {
            const dataIndex = context.dataIndex;
                return '$'+holdings[dataIndex].value.toFixed(2) ;
          }
        }
      }
    },
    
    plugins: [ChartDataLabels]
  });
});




createDynamic(jsonData);