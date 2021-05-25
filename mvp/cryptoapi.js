// === UI === //

const coinsListElement = document.getElementById("coinsList")

function addTrendingTokenButton(token) {
  coinsListElement.innerHTML += `<button class="chooseCryptoButton" onclick="getGraphFor(${token.id})">${token.name} (${token.symbol})</button>`
}

function setupDataGraph(graphLabel, dataLabels, dataEntries) {
  var graphLabels = dataLabels
  var graphData = dataEntries

  const data = {
    labels: graphLabels,
    datasets: [{
      label: graphLabel,
      backgroundColor: 'tomato',
      borderColor: 'tomato',
      data: graphData,
    }]
  };

  const config = {
    type: 'bar',
    data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  var myCryptoDataChart = new Chart(
    document.getElementById('graph'),
    config
  );
}

// === CRYPTO DATA POPULATION === //

const api = "https://api.coingecko.com/api/v3"

const topTenCrypto = fetch(`${api}/coins/markets?vs_currency=usd&order=market_cap&per_page=10`)
  .then(response => response.json())
  .then(tokens => prepareTokenGraphData(tokens))

// const trendingCrypto = fetch(`${api}/search/trending`)
//   .then(response => response.json())
//   .then(tokens => prepareTokenGraphData(tokens.coins.map(token => token.item)))

function getToken90DayMarketData(tokenId) {
  return fetch(`${api}/coins/${tokenId}/market_chart?vs_currency=usd&days=90`)
    .then(response => response.json())
    .then(data => data)
}

function calculateTokenPriceVolatility(tokenPriceData) {
  var minPrice = 100000000000000
  var maxPrice = 0
  tokenPriceData.forEach(price => {
    if (price[1] < minPrice) minPrice = price[1]
    if (price[1] > maxPrice) maxPrice = price[1]
  })
  return ((maxPrice - minPrice) / 2) / maxPrice
}

function prepareTokenGraphData(tokens) {
  var tokenSymbols = []
  var tokenVolatilityData = []
  tokens.map(token => {
    addTrendingTokenButton(token)
    tokenSymbols.push(token.symbol.toUpperCase())
    getToken90DayMarketData(token.id).then(
      data => {
        var tokenPriceVolatility = calculateTokenPriceVolatility(data.prices)
        tokenVolatilityData.push(tokenPriceVolatility.toFixed(2) * 100)
        if (tokenVolatilityData.length == tokens.length) {
          setupDataGraph("Token Volatility Graph", tokenSymbols, tokenVolatilityData)
        }
      }
    )
  })
}