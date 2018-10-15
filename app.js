let stockSymbolArray = '';

const stockList = ['AAPL', 'BNED', 'CAKE', 'DSW', 'EAD', 'FRAN'];


const showStockInfo = function () {
 
  const stock = $(this).attr('data-name');
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,logo,news&range=1m&last=10&filter=symbol,companyName,latestPrice,headline,source,url,summary`;

  // Ajax call//
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {
    console.log(response)


    // div to hold the stock//
    const stockDiv = $('<div>').addClass('stock');


    //stock name//
    const companyName = response.quote.companyName;
    const nameHolder = $('<h3>').text(companyName);
    nameHolder.addClass('name');
    stockDiv.append(nameHolder);

      //stock logo//
      const logo = response.logo.url;
      const image = $('<img>')
      image.attr("src", logo);
      stockDiv.append(image);
  

    //stock price//
    const stockPrice = response.quote.latestPrice;
    const priceHolder = $('<p>').text(`Stock Price: $${stockPrice}`);
    priceHolder.addClass('prices');
    stockDiv.append(priceHolder);

     //stock news articles//
     const stockNews = response.news;
     stockNews.forEach(function (newsItem) {
       const title = newsItem.headline
       const summary  = newsItem.summary
       const link = newsItem.url
       const articleHolder = $('<div>').html(`<h5 class="card-header">${title}</h5><p class="card-body">${summary} <a href="${link}">Read full article</a></p>`);
       stockDiv.append(articleHolder);
     }); 
 
     //putting stock info on the page//

     $('#stock-info').prepend(stockDiv);

  });

}

// Function for displaying stock data
const render = function () {

  // Deleting the stocks to prevent repeat buttons//
  $('#button-spot').empty();

  //creating buttons for each stock in the array//
  for (let i = 0; i < stockList.length; i++) {

    const newButton = $('<button>');
        newButton.addClass('stock-btn btn');
        newButton.attr('data-name', stockList[i]);
        newButton.text(stockList[i]);
       
    $('#button-spot').append(newButton);
  }
}

//function for adding a new stock button//
const addButton = function(event) {
  event.preventDefault();

  const stock = $('#stock-input').val().trim().toUpperCase();
  stockSymbolArray.forEach(function (validationList){
    if (validationList.symbol === stock) {
      stockList.push(stock);
    }
  })

  $('#stock-input').val('');
  render();
}


//declare function with api call//

const getStockSymbols = function() {
  $.ajax({
    url: 'https://api.iextrading.com/1.0/ref-data/symbols',
    method: 'GET'
  }).then(function(response) {
    stockSymbolArray = response; 

})
} 

$('#add-stock').on('click', addButton);
$('#button-spot').on('click', '.stock-btn', showStockInfo);

render();
getStockSymbols();