'use strict'

require('./kyConsole').init();

var http = require('http');
var url = require('url');
var request = require('request');
var sys = require('util');
var WebSocket = require('ws');
var chance = require('chance');
var autobahn = require('autobahn');
var moment = require('moment');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465, 					// SMTP 端口
    secureConnection: true, 	// 使用 SSL
    auth: {
        user: '943295050@qq.com',
        pass: 'lfxhuvmrytxobcjh'
    }
});
var mailOptions = {
    from: '943295050@qq.com', 	// 发件地址
    to: '54001432@qq.com', 		// 收件列表
    subject: 'Hello sir', 		// 标题
    text: ''
};

var startCoin = 3;

//var path = ["ETH", "MANA", "USD", "ETH"];
//var market = [["binance", "MANAETH", "MANA", "ETH"], ["hitbtc", "MANAUSD", "MANA", "USD"], ["hitbtc", "ETHUSD", "ETH", "USD"]];
//var path = ["ETH", "USD", "MANA", "ETH"];
//var market = [["hitbtc", "ETHUSD", "ETH", "USD"], ["hitbtc", "MANAUSD", "MANA", "USD"], ["binance", "MANAETH", "MANA", "ETH"]];
//var path = ["ETH", "XVG", "USD", "ETH"];
//var market = [["binance", "XVGETH", "XVG", "ETH"], ["hitbtc", "XVGUSD", "XVG", "USD"], ["hitbtc", "ETHUSD", "ETH", "USD"]];
//var path = ["ETH", "LTC", "USD", "ETH"];
//var market = [["binance", "LTCETH", "LTC", "ETH"], ["hitbtc", "LTCUSD", "LTC", "USD"], ["hitbtc", "ETHUSD", "ETH", "USD"]];
//var path = ["ETH", "ENJ", "USD", "ETH"];
//var market = [["binance", "ENJETH", "ENJ", "ETH"], ["hitbtc", "ENJUSD", "ENJ", "USD"], ["hitbtc", "ETHUSD", "ETH", "USD"]];
//var path = ["ETH", "XRP", "USD", "ETH"];
//var market = [["binance", "XRPETH", "XRP", "ETH"], ["hitbtc", "XRPUSDT", "XRP", "USD"], ["hitbtc", "ETHUSD", "ETH", "USD"]];
//var path = ["ETH", "BCH", "USD", "ETH"];
//var market = [["binance", "BCCETH", "BCH", "ETH"], ["hitbtc", "BCHUSD", "BCH", "USD"], ["hitbtc", "ETHUSD", "ETH", "USD"]];
//var path = ["ETH", "DASH", "USD", "ETH"];
//var market = [["binance", "DASHETH", "DASH", "ETH"], ["hitbtc", "DASHUSD", "DASH", "USD"], ["hitbtc", "ETHUSD", "ETH", "USD"]];
//var path = ["ETH", "TRX", "USD", "ETH"];
//var market = [["binance", "TRXETH", "TRX", "ETH"], ["hitbtc", "TRXUSD", "TRX", "USD"], ["hitbtc", "ETHUSD", "ETH", "USD"]];

var path = ["ETH", "MANA", "USD", "ETH"];
var market = [["binance", "MANAETH", "MANA", "ETH"], ["okex", "mana_usdt", "MANA", "USD"], ["okex", "eth_usdt", "ETH", "USD"]];
//var path = ["ETH", "TRX", "USD", "ETH"];
//var market = [["binance", "TRXETH", "TRX", "ETH"], ["okex", "trx_usdt", "TRX", "USD"], ["okex", "eth_usdt", "ETH", "USD"]];

var marketDatas = [
	{
		showMeTheMoney: -1,
		path: ["ETH", "MANA", "USD", "ETH"],
		market: [
			{
				state: 'none',
				name: 'binance',
				symbol: 'MANAETH',
				ask: [],
				askGet: 'MANA',
				bid: [],
				bidGet: 'ETH'
			},
			{
				state: 'none',
				name: 'okex',
				symbol: 'mana_usdt',
				ask: [],
				askGet: 'MANA',
				bid: [],
				bidGet: 'USD'
			},
			{
				state: 'none',
				name: 'okex',
				symbol: 'eth_usdt',
				ask: [],
				askGet: 'ETH',
				bid: [],
				bidGet: 'USD'
			}
		]
	},
	{
		showMeTheMoney: -1,
		path: ["ETH", "TRX", "USD", "ETH"],
		market: [
			{
				state: 'none',
				name: 'binance',
				symbol: 'TRXETH',
				ask: [],
				askGet: 'TRX',
				bid: [],
				bidGet: 'ETH'
			},
			{
				state: 'none',
				name: 'okex',
				symbol: 'trx_usdt',
				ask: [],
				askGet: 'TRX',
				bid: [],
				bidGet: 'USD'
			},
			{
				state: 'none',
				name: 'okex',
				symbol: 'eth_usdt',
				ask: [],
				askGet: 'ETH',
				bid: [],
				bidGet: 'USD'
			}
		]
	},
	{
		showMeTheMoney: -1,
		path: ["ETH", "USD", "MANA", "ETH"],
		market: [
			{
				state: 'none',
				name: 'okex',
				symbol: 'eth_usdt',
				ask: [],
				askGet: 'ETH',
				bid: [],
				bidGet: 'USD'
			},		
			{
				state: 'none',
				name: 'okex',
				symbol: 'mana_usdt',
				ask: [],
				askGet: 'MANA',
				bid: [],
				bidGet: 'USD'
			},			
			{
				state: 'none',
				name: 'binance',
				symbol: 'MANAETH',
				ask: [],
				askGet: 'MANA',
				bid: [],
				bidGet: 'ETH'
			}
		]
	}	
];

start();

function start()
{
	console.log("初始化完毕");
	
	setInterval(function(){ process(startCoin); }, 2000, "Interval");
}

function processMarket(marketData)
{
	switch(marketData.name)
	{
	case "binance":
		{
			request.get(
			{
				url: "https://www.binance.com/api/v1/depth?symbol=" + marketData.symbol,
				json: true
			},
			function(err, httpRes, body)
			{
				if(err)
				{
					console.log("err get binance by " + marketData.symbol + "!!!");
					return;
				}

				Promise.resolve(body)
  					.then(JSON.parse)
  					.then((getJson) => {
						marketData.ask = [];
						marketData.bid = [];

						for (var i = 0; i < getJson.asks.length; i++)
						{
							var ask = {};
							ask.price = getJson.asks[i][0];
							ask.size = getJson.asks[i][1];
							marketData.ask.push(ask);
						}
						for (var j = 0; j < getJson.bids.length; j++)
						{
							var bid = {};
							bid.price = getJson.bids[j][0];
							bid.size = getJson.bids[j][1];
							marketData.bid.push(bid);
						}

						marketData.state = 'ready';
  				}, (err) => {
    				console.log("binance " + err.message);
  				});				
			});
		}
		break;
	case "hitbtc":
		{
			request.get(
			{
				url: "https://api.hitbtc.com/api/2/public/orderbook/" + marketData.symbol
			},
			function(err, httpRes, body)
			{
				if(err)
				{
					console.log("err get binance by " + marketData.symbol + "!!!");
					return;
				}

				Promise.resolve(body)
  					.then(JSON.parse)
  					.then((getJson) => {
  						if (getJson.error) {
  							console.log(getJson.error.message);
  							console.log(getJson.error.description);
  							return;
  						}

						marketData.ask = [];
						marketData.bid = [];

						for (var i = 0; i < getJson.ask.length; i++)
						{
							marketData.ask.push(getJson.ask[i]);
						}
						for (var j = 0; j < getJson.bid.length; j++)
						{
							marketData.bid.push(getJson.bid[j]);
						}

						marketData.state = 'ready';
  				}, (err) => {
    				console.log("hitbtc " + err.message);
  				});
			});		
		}
		break;
	case "poloniex":
		{
			console.log("poloniex");

			var wsuri = "wss://api.poloniex.com";
			var connection = new autobahn.Connection({
			  url: wsuri,
			  realm: "realm1"
			});

			connection.onopen = function (session) {
				function marketEvent (args,kwargs) {
					console.log(args);
				}
				function tickerEvent (args,kwargs) {
					console.log(args);
				}
				function trollboxEvent (args,kwargs) {
					console.log(args);
				}
				session.subscribe('BTC_XMR', marketEvent);
				session.subscribe('ticker', tickerEvent);
				session.subscribe('trollbox', trollboxEvent);

				console.log("on open");
			}

			connection.onclose = function () {
			  console.log("Websocket connection closed");
			}
		       
			connection.open();
		}
		break;
	case "okex":
		{
			request.get(
			{
				url: "https://www.okex.com/api/v1/depth.do?symbol=" + marketData.symbol,
				json: true
			},
			function(err, httpRes, body)
			{
				if(err)
				{
					console.log("err get okex by " + marketData.symbol + "!!!");
					return;
				}

				Promise.resolve(body)
  					.then(JSON.parse)
  					.then((getJson) => {
						marketData.ask = [];
						marketData.bid = [];

						for (var i = 0; i < getJson.asks.length; i++)
						{
							var ask = {};
							ask.price = getJson.asks[i][0];
							ask.size = getJson.asks[i][1];
							marketData.ask.push(ask);
						}
						marketData.ask.reverse();
						for (var j = 0; j < getJson.bids.length; j++)
						{
							var bid = {};
							bid.price = getJson.bids[j][0];
							bid.size = getJson.bids[j][1];
							marketData.bid.push(bid);
						}

						marketData.state = 'ready';
  				}, (err) => {
    				console.log("okex " + err.message);
  				});
			});
		}
		break;		
	}
}

function process(coinCount)
{
	for (var i = 0; i < marketDatas.length; i++)
	{
		var data = marketDatas[i];

		var isReady = true;
		for (var k = 0; k < data.market.length; k++)
		{
			processMarket(data.market[k]);

			if (isReady === true) {
				isReady = data.market[k].state === 'ready';
			}
		}
		if (isReady === false) {
			continue;
		}

		var srcCoinCount = coinCount;
		var desCoinCount = coinCount;
		var perPrice = 0;
		var info = '';

		for (var j = 1; j < data.path.length; j++)
		{
			if (j != 1) {
				info += '\n';
			}
			
			srcCoinCount = desCoinCount;

			var targetCoin = data.path[j];
			var market = data.market[j - 1];

			if (market.askGet == targetCoin) {
				desCoinCount = buy(market.ask, srcCoinCount);
				perPrice = srcCoinCount / desCoinCount;
			} else {
				desCoinCount = sell(market.bid, srcCoinCount);
				perPrice = desCoinCount / srcCoinCount;
			}

			info += '购买' + targetCoin + '个数:' + desCoinCount + '  均价:' + perPrice;
		}

		var v = (desCoinCount / coinCount) * 100 - 100;
		
		var title = moment().format() + " * " + data.path[0] + "->" + data.path[1] + "->" + data.path[2] + "->" + data.path[3];
		info = "测试搬砖个数:" + startCoin + '\n' + info + '\n' + "最后收益:" + v.toFixed(2) + "%";

		if (v > 0) {
			console.log(title);
			console.log(info);
			console.log("++++++++++++++++");
		}

		if (data.showMeTheMoney > 0) {
			if (v > data.showMeTheMoney) {
				var value = v;
				var marketIndex = i;
				mailOptions.subject = "新高！！！搬砖" + data.path[1] + "获利" + v.toFixed(2) + "%";
				mailOptions.text = title + '\n' + info;
				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				    	marketDatas[marketIndex].showMeTheMoney = -1;
				        return console.log(error);
				    }
				    console.log('Message sent: ' + info.response);
				    marketDatas[marketIndex].showMeTheMoney = value;
				});			
				data.showMeTheMoney = 0;
			} else if (v <= 0) {
				mailOptions.subject = "结束！！！搬砖" + data.path[1] + "获利" + v.toFixed(2) + "%";
				mailOptions.text = title + '\n' + info;			
				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        return console.log(error);
				    }
				    console.log('Message sent: ' + info.response);
				});			
				data.showMeTheMoney = -1;
			}
		} else if (data.showMeTheMoney < 0 && v >= 5) {
			mailOptions.subject = "开始！！！搬砖" + data.path[1] + "获利" + v.toFixed(2) + "%";
			mailOptions.text = title + '\n' + info;
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        return console.log(error);
			    }
			    console.log('Message sent: ' + info.response);
			});			
			data.showMeTheMoney = v;
		}
	}
}

function buy(data, total)
{	
	var buyCount = 0;
	for (var i = 0; i < data.length; i++)
	{
		var p = parseFloat(data[i].price);
		var c = parseFloat(data[i].size);

		var count = p * c;
		if (count > total) {
			buyCount = parseFloat(buyCount + total / p);
			total = 0;
			break;
		} else {
			buyCount = parseFloat(buyCount + c);
			total = total - count;
		}
	}

	if (total > 0) {
		console.log("market coin not enough!");
	}

	return buyCount;
}
function sell(data, total)
{
	var sellCount = 0;
	for (var i = 0; i < data.length; i++)
	{
		var p = parseFloat(data[i].price);
		var c = parseFloat(data[i].size);

		var count = p * c;
		if (count > total) {
			sellCount = parseFloat(sellCount + total * p);
			total = 0;
			break;
		} else {
			sellCount = parseFloat(sellCount + count);
			total = total - c;
		}					
	}

	if (total > 0) {
		console.log("market coin not enough!");
	}

	return sellCount;
}

