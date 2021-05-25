/**
 * CryptoCalc.js v0.2
 * ==================
 * Requires the following to run:
 * - Javascript ES6
 * - Chart.js
 */

const cryptoAPI = "https://api.coingecko.com/api/v3"

class Token {
  constructor(tokenId) {
    this.id = tokenId
  }

  getTokenId() { return this.id }
}

class TokenList {
  constructor(tokens) {
    this.tokens = tokens
  }

  addTokenToList(token) { this.tokens.push(token) }
  getTokenList() { return this.tokens }
  setTokenList(tokens) { this.tokens = tokens }
  resetTokenList() { this.tokens = {} }
}

class Graph {
  constructor(title, labels, values) {
    this.title = title
    this.labels = labels
    this.values = values
  }

  buildGraph(elementId) {
    const data = {
      labels: this.labels,
      datasets: [{
        label: this.title,
        backgroundColor: 'tomato',
        borderColor: 'tomato',
        data: this.values,
      }]
    }

    const config = {
      type: 'bar',
      data
    }

    var targetGraphElement = document.getElementById(elementId)
    new Chart(targetGraphElement, config)
  }
}

async function getJSONFromURL(endpoint) {
  let response = await fetch(endpoint)
  if (response.status === 200) {
    let json = await response.json()
    return json
  }
  throw new Error(response.status)
}

async function getToken90DayMarketData(tokenId) {
  const marketDataURL = `${cryptoAPI}/coins/${tokenId}/market_chart?vs_currency=usd&days=90`
  return await getJSONFromURL(marketDataURL)
}

function calculateTokenVolatility(tokenPrices) {
  if (tokenPrices) {
    var minPrice = 100000000000000
    var maxPrice = 0
    tokenPrices.forEach(price => {
      if (price[1] < minPrice) minPrice = price[1]
      if (price[1] > maxPrice) maxPrice = price[1]
    })
    return ((maxPrice - minPrice) / 2) / maxPrice
  } else {
    console.log("tokenPrices empty!")
  }
}

function addTrendingTokenButton(token) {
  coinsListElement.innerHTML += `<button class="chooseCryptoButton" onclick="getGraphFor(${token.id})">${token.name} (${token.symbol})</button>`
}

// === Business Logic === //

const topTenCryptoURL = `${cryptoAPI}/coins/markets?vs_currency=usd&order=market_cap&per_page=10`
const topTenCrypto = getJSONFromURL(topTenCryptoURL)

const trendingCryptoURL = `${cryptoAPI}/search/trending`
const trendingCrypto = getJSONFromURL(trendingCryptoURL)



var btc = new Token("bitcoin")
var tokenList = new TokenList([btc])
var tokenGraph = new Graph("Token 90-Day Volality", ["btc"], [69])