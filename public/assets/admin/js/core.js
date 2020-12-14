function priceChart()
{
  priceChartData = {
    labels: ['Min', 'Current', 'Max'],
    series: [[200, 280, 400]]
  }
  priceChartOptions = {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0
    }),
    low: 0,
    high: 500,
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
  };
  var priceChart = new Chartist.Line('#dailySalesChart', priceChartData, priceChartOptions);
}
