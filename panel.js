chrome.devtools.network.onRequestFinished.addListener(request => {
  request.getContent((body) => {
    if (request.request && request.request.url) {
      if (request.request.url.includes('/api/v1/portfolio/stats/symphony')) {
        chrome.runtime.sendMessage({
            response: body
        });
	if(body != null){
		createDynamic(body);
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
        "percent_change": null,
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
  const columnDefs = [
    { field: "ticker", headerName: "Ticker", width: 100 },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "current_price", headerName: "Current Price", width: 120 },
    { field: "value", headerName: "Value", width: 100 },
    { field: "current_allocation", headerName: "Current Allocation", width: 150 }
  ];

  const portfolioData = Object.values(data);
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



//createDynamic(jsonData);