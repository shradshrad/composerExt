chrome.devtools.network.onRequestFinished.addListener(request => {
  request.getContent((body) => {
    if (request.request && request.request.url) {
      if (request.request.url.includes('/api/v1/portfolio/stats/symphony')) {
        chrome.runtime.sendMessage({
            response: body
        });
	if(body != null && isLiveUpdatesOn){
		createDynamic(JSON.parse(body));
    console.log(body);
	}
	
  }
    }
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const button = document.querySelector("#liveUpdates");
  button.addEventListener("click", function() {
    ///button.textContent = button.textContent === "Start Live Updates" ? "Stop Live Updates" : "Start Live Updates";
    // Update the data here
    switchLiveUpdates();

    if(isLiveUpdatesOn){
      button.textContent = "Stop Updates";
    }else{
      button.textContent = "Start Updates";
    }
  });
});



const columnDefs = [
  { field: "ticker", headerName: "Ticker", width: 100,      sortable: true,filter: true   },
  { field: "amount", headerName: "Amount", width: 100,      sortable: true,filter: "agNumberColumnFilter", type: "numeric" },
  { field: "percent_change", headerName: "Percentage Change", width: 150, sortable: true, filter: "agNumberColumnFilter",  type: "numeric",
  cellRenderer: function(params) {
   
    if (params.value === null || params.value === undefined) {
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
    if(params.value === null || params.value === undefined) {
      return;
    }
    return '$' + params.value.toFixed(2);

  },
},
  { field: "current_allocation", headerName: "Current Allocation", width: 150, sortable: true,filter: "agNumberColumnFilter", type: "numeric",
  //Convert value to percentage and show percentage sign after value
  cellRenderer: function(params) {
    if(params.value === null || params.value === undefined) {
      return;
    }
    return (params.value * 100).toFixed(2) + '%';
   }
  }
  
];

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    resizable: true
  }
};

const gridDiv = document.querySelector("#gridContainer");
new agGrid.Grid(gridDiv, gridOptions);

function createDynamic(data) {
  //Allow columns to be sorted
  

  const portfolioData = Object.values(data);
  const rowData = portfolioData.flatMap(item => item.holdings);

  
  gridOptions.api.setRowData(rowData);

 
}
var isLiveUpdatesOn = false;
function switchLiveUpdates(){
  isLiveUpdatesOn = !isLiveUpdatesOn;
  alert(isLiveUpdatesOn);
 
}
createDynamic(jsonData);

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


const jsonData = {"JJeCo7c8hPiFMXKhDmlX":{"annualized_rate_of_return":1.8141146393609069,"value":51.81161249479,"sharpe_ratio":3.0792215925760384,"deposit_adjusted_value":51.811612494790005,"max_drawdown":0.028818322134702364,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.03,"current_allocation":0.02},{"ticker":"MSTR","amount":0.168078683,"percent_change":null,"current_price":302.13,"value":50.78161249479,"current_allocation":0.98}],"todays_percent_change":-4.053162899999753E-12,"todays_dollar_change":-2.100009055538976E-10},"c3j0jkjw0DwRWpOxMpQd":{"annualized_rate_of_return":2.996085101746491,"value":52.17765699484,"sharpe_ratio":5.615607118726751,"deposit_adjusted_value":52.17765699483999,"max_drawdown":0.018372787790632207,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.13,"current_allocation":0.022},{"ticker":"BTAL","amount":0.607504466,"percent_change":null,"current_price":19.54,"value":11.87063726564,"current_allocation":0.228},{"ticker":"DBC","amount":0.536418616,"percent_change":null,"current_price":22.7,"value":12.1767025832,"current_allocation":0.233},{"ticker":"FAS","amount":0.214586255,"percent_change":null,"current_price":59.1,"value":12.6820476705,"current_allocation":0.243},{"ticker":"TMF","amount":1.847518642,"percent_change":null,"current_price":7.75,"value":14.3182694755,"current_allocation":0.274}],"todays_percent_change":-3.0664468750252928E-12,"todays_dollar_change":-1.6000001323845936E-10},"6esLPCu3AIzb6gMm24F2":{"annualized_rate_of_return":1.174777266757955,"value":51.38968794979,"sharpe_ratio":2.2832698026617484,"deposit_adjusted_value":51.389687949789995,"max_drawdown":0.03690109936135027,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.03,"current_allocation":0.02},{"ticker":"MSTR","amount":0.166682183,"percent_change":null,"current_price":302.13,"value":50.35968794979,"current_allocation":0.98}],"todays_percent_change":-1.9455371440633263E-4,"todays_dollar_change":-0.010000000209998916},"2enMckvByb6hQ3EhMZlD":{"annualized_rate_of_return":-0.13827880761345734,"value":49.77547501358,"sharpe_ratio":-6.3554555895540235,"deposit_adjusted_value":49.77547501358,"max_drawdown":0.00471341250435429,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.01,"current_allocation":0.02},{"ticker":"SHY","amount":0.599231691,"percent_change":null,"current_price":81.38,"value":48.76547501358,"current_allocation":0.98}],"todays_percent_change":-8.437926729773331E-12,"todays_dollar_change":-4.200018111077952E-10},"ZwqOhhdACVrAPIB9d8BC":{"annualized_rate_of_return":0.0,"value":50.05582844138,"sharpe_ratio":"NaN","deposit_adjusted_value":50.05582844138001,"max_drawdown":0.0,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.19,"current_allocation":0.024},{"ticker":"VEA","amount":0.132643298,"percent_change":null,"current_price":45.99,"value":6.10026527502,"current_allocation":0.122},{"ticker":"XLK","amount":0.060913523,"percent_change":null,"current_price":166.9,"value":10.1664669887,"current_allocation":0.203},{"ticker":"TIP","amount":0.041249372,"percent_change":null,"current_price":107.63,"value":4.43966990836,"current_allocation":0.089},{"ticker":"IAU","amount":0.119421577,"percent_change":null,"current_price":36.94,"value":4.41143305438,"current_allocation":0.088},{"ticker":"SSO","amount":0.250840444,"percent_change":null,"current_price":54.13,"value":13.57799323372,"current_allocation":0.271},{"ticker":"NTSX","amount":0.280939226,"percent_change":null,"current_price":36.2,"value":10.1699999812,"current_allocation":0.203}],"todays_percent_change":7.591630632180335E-12,"todays_dollar_change":3.800053605118592E-10},"0qApxBPobq5uOXODow0J":{"annualized_rate_of_return":-0.7748495504621744,"value":48.46000000000,"sharpe_ratio":-4.920509596516066,"deposit_adjusted_value":48.46,"max_drawdown":0.05238073199933556,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":24.79,"current_allocation":0.512},{"ticker":"VIXM","amount":1.0,"percent_change":null,"current_price":23.67,"value":23.67,"current_allocation":0.488}],"todays_percent_change":0.0,"todays_dollar_change":0.0},"q80neBNpXZy1bjjhT2qB":{"annualized_rate_of_return":10.01074867184408,"value":52.39460883725,"sharpe_ratio":7.030540564114208,"deposit_adjusted_value":52.39460883724998,"max_drawdown":0.023825493675927425,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.03,"current_allocation":0.02},{"ticker":"SOXL","amount":0.764253563,"percent_change":null,"current_price":22.02,"value":16.82886345726,"current_allocation":0.321},{"ticker":"FAS","amount":0.293061341,"percent_change":null,"current_price":59.1,"value":17.3199252531,"current_allocation":0.331},{"ticker":"UPRO","amount":0.402332791,"percent_change":null,"current_price":42.79,"value":17.21582012689,"current_allocation":0.329}],"todays_percent_change":4.771432819120326E-12,"todays_dollar_change":2.4999735614983365E-10},"1BVZRp1Kn24cLYOLNLLS":{"annualized_rate_of_return":0.0,"value":49.98176468535,"sharpe_ratio":"NaN","deposit_adjusted_value":49.98176468535001,"max_drawdown":0.0,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.02,"current_allocation":0.02},{"ticker":"TECL","amount":1.013071895,"percent_change":null,"current_price":48.33,"value":48.96176468535,"current_allocation":0.98}],"todays_percent_change":7.002536684859152E-12,"todays_dollar_change":3.4999914078071015E-10},"zHtLB5UDvy2ZqCpf8OVb":{"annualized_rate_of_return":2.618111241859396,"value":52.0982205457858,"sharpe_ratio":9.086081739740502,"deposit_adjusted_value":52.09822054578581,"max_drawdown":0.008795418830092782,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.12,"current_allocation":0.021},{"ticker":"UPRO","amount":0.094368496,"percent_change":null,"current_price":42.79,"value":4.03802794384,"current_allocation":0.078},{"ticker":"VGLT","amount":0.258113979,"percent_change":null,"current_price":63.15,"value":16.29989777385,"current_allocation":0.313},{"ticker":"OILK","amount":0.029509941,"percent_change":null,"current_price":40.8338,"value":1.2050030288058,"current_allocation":0.023},{"ticker":"COMT","amount":0.047126081,"percent_change":null,"current_price":25.91,"value":1.22103675871,"current_allocation":0.023},{"ticker":"TECL","amount":0.0924247,"percent_change":null,"current_price":48.33,"value":4.466885751,"current_allocation":0.086},{"ticker":"TQQQ","amount":0.118432941,"percent_change":null,"current_price":36.82,"value":4.36070088762,"current_allocation":0.084},{"ticker":"FAS","amount":0.064340813,"percent_change":null,"current_price":59.1,"value":3.8025420483,"current_allocation":0.073},{"ticker":"GLD","amount":0.006648573,"percent_change":null,"current_price":181.05,"value":1.20372414165,"current_allocation":0.023},{"ticker":"PDBC","amount":0.268118059,"percent_change":null,"current_price":13.63,"value":3.65444914417,"current_allocation":0.07},{"ticker":"VGIT","amount":0.181365456,"percent_change":null,"current_price":59.14,"value":10.72595306784,"current_allocation":0.206}],"todays_percent_change":-4.1114688923609634E-12,"todays_dollar_change":-2.142002131222398E-10},"G4z70uNhfp61yw58p7YO":{"annualized_rate_of_return":0.0,"value":49.97605424235,"sharpe_ratio":"NaN","deposit_adjusted_value":49.97605424235,"max_drawdown":0.0,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.04,"current_allocation":0.021},{"ticker":"QQQ","amount":0.069046598,"percent_change":null,"current_price":354.65,"value":24.4873759807,"current_allocation":0.49},{"ticker":"FNGS","amount":0.765216847,"percent_change":null,"current_price":31.95,"value":24.44867826165,"current_allocation":0.489}],"todays_percent_change":7.003478996425485E-12,"todays_dollar_change":3.5000624620806775E-10},"gLsxmqMhRRpfttMQgYll":{"annualized_rate_of_return":-0.6447262312830737,"value":48.38958468481,"sharpe_ratio":-2.4206990376789745,"deposit_adjusted_value":48.38958468481,"max_drawdown":0.08157015576082645,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.03,"current_allocation":0.021},{"ticker":"TECL","amount":0.979921057,"percent_change":null,"current_price":48.33,"value":47.35958468481,"current_allocation":0.979}],"todays_percent_change":-3.926446750454287E-12,"todays_dollar_change":-1.899991275422508E-10},"mjAR4IDvnU1OSYTQuwof":{"annualized_rate_of_return":-0.8279830220548722,"value":47.33000000000,"sharpe_ratio":-3.62711135580889,"deposit_adjusted_value":47.330000000000005,"max_drawdown":0.10019011406844111,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":23.66,"current_allocation":0.5},{"ticker":"VIXM","amount":1.0,"percent_change":null,"current_price":23.67,"value":23.67,"current_allocation":0.5}],"todays_percent_change":0.0,"todays_dollar_change":0.0},"K5DRnGLS3K1loR8ypscT":{"annualized_rate_of_return":0.0,"value":49.99971405953,"sharpe_ratio":"NaN","deposit_adjusted_value":49.99971405953,"max_drawdown":0.0,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.31,"current_allocation":0.026},{"ticker":"SVXY","amount":0.025529003,"percent_change":null,"current_price":75.63,"value":1.93075849689,"current_allocation":0.039},{"ticker":"TQQQ","amount":0.846680058,"percent_change":null,"current_price":36.82,"value":31.17475973556,"current_allocation":0.623},{"ticker":"TECL","amount":0.322453876,"percent_change":null,"current_price":48.33,"value":15.58419582708,"current_allocation":0.312}],"todays_percent_change":-9.400107825801303E-12,"todays_dollar_change":-4.700027034232335E-10},"ekEn8eK742VTyg979iyJ":{"annualized_rate_of_return":0.5831966445077885,"value":50.29000000000,"sharpe_ratio":5.015103732637364,"deposit_adjusted_value":50.29,"max_drawdown":0.003414471904397594,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":2.95,"current_allocation":0.059},{"ticker":"VIXM","amount":2.0,"percent_change":null,"current_price":23.67,"value":47.34,"current_allocation":0.941}],"todays_percent_change":-1.4128907054287136E-16,"todays_dollar_change":-7.105427357601002E-15},"CHsQ1Et8XesXXwJJFRoE":{"annualized_rate_of_return":7.259604256225439,"value":51.19778975970,"sharpe_ratio":41.50471787703101,"deposit_adjusted_value":51.1977897597,"max_drawdown":0.0,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":2.15,"current_allocation":0.042},{"ticker":"VGLT","amount":0.030907778,"percent_change":null,"current_price":63.15,"value":1.9518261807,"current_allocation":0.038},{"ticker":"UUP","amount":0.156894262,"percent_change":null,"current_price":28.57,"value":4.48246906534,"current_allocation":0.088},{"ticker":"HYG","amount":0.047684106,"percent_change":null,"current_price":74.58,"value":3.55628062548,"current_allocation":0.069},{"ticker":"SPY","amount":0.008269638,"percent_change":null,"current_price":427.92,"value":3.53874349296,"current_allocation":0.069},{"ticker":"TQQQ","amount":0.272493573,"percent_change":null,"current_price":36.82,"value":10.03321335786,"current_allocation":0.196},{"ticker":"QLD","amount":0.292327321,"percent_change":null,"current_price":59.6,"value":17.4227083316,"current_allocation":0.34},{"ticker":"IEI","amount":0.025639272,"percent_change":null,"current_price":116.27,"value":2.98107815544,"current_allocation":0.058},{"ticker":"GLD","amount":0.009916152,"percent_change":null,"current_price":181.05,"value":1.7953193196,"current_allocation":0.035},{"ticker":"VGIT","amount":0.02148444,"percent_change":null,"current_price":59.14,"value":1.2705897816,"current_allocation":0.025},{"ticker":"PSQ","amount":0.181255526,"percent_change":null,"current_price":11.12,"value":2.01556144912,"current_allocation":0.039}],"todays_percent_change":-5.859593741674678E-12,"todays_dollar_change":-2.999982484652719E-10},"6eo6Ktg8t1Vt99NJDpfL":{"annualized_rate_of_return":225.54776719462618,"value":59.02727301481,"sharpe_ratio":8.316213767998946,"deposit_adjusted_value":59.027273014809985,"max_drawdown":0.03286704849514261,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":10.15,"current_allocation":0.172},{"ticker":"SOXL","amount":1.343422793,"percent_change":null,"current_price":22.02,"value":29.58216990186,"current_allocation":0.501},{"ticker":"FNGU","amount":0.116537435,"percent_change":null,"current_price":165.57,"value":19.29510311295,"current_allocation":0.327}],"todays_percent_change":-3.2188362741061788E-12,"todays_dollar_change":-1.899991275422508E-10},"iejlqSeLXHTTceUFlFJF":{"annualized_rate_of_return":240.69503220884934,"value":59.2081283170,"sharpe_ratio":10.913928597811196,"deposit_adjusted_value":59.20812831699999,"max_drawdown":0.01993613805806789,"net_deposits":50,"holdings":[{"ticker":"USD","current_price":null,"percent_change":null,"amount":0.0,"value":1.01,"current_allocation":0.017},{"ticker":"TQQQ","amount":1.58061185,"percent_change":null,"current_price":36.82,"value":58.198128317,"current_allocation":0.983}],"todays_percent_change":-1.688672081371283E-4,"todays_dollar_change":-0.00999999999999801}};

