'use strict';

/**
 * Requires
 */
const rp = require('request-promise');
const moment = require('moment');

const config = require('./config');
const helper = require('./helper');

/**
 * Commands
 */
module.exports = {
  /**
   * Fake a error promise
   *
   * @param {string} error Error Message
   *
   * @return {object} Rejected Request Promise
   */
  error(error) {
    return Promise.reject(new Error(error));
  },

  /**
   * GET Coin Price
   * @param {object} commandArguments Command Arguments
   *
   * @return {object} Request promise
   */
  coinprice(commandArguments) {
    const fromCurrency = "BTC";
    const toCurrency = "AUD";
    const serviceName = "ccservice";

    let coinPriceQuery = `fsym=`
    //https://min-api.cryptocompare.com/data/price?fsym={{fromcurrency}}&tsyms={{tocurrency}}&extraParams={{ccservice}}

    if (fromCurrency !== '') {
      coinPriceQuery += `${fromCurrency}&tsyms=${toCurrency}`

      //console.log(`DEBUG : CoinPriceQuery :  ${config.ccMinAPIUrl}/data/price?${coinPriceQuery}&extraParams=${serviceName}`);

      return rp({
        uri: `${config.ccMinAPIUrl}/data/price?${coinPriceQuery}&extraParams=${serviceName}`,
        json: true
      })
      .then((res) => {
        return JSON.stringify(res); 
      })
      .catch((err) => {
        return helper.formatMessage('Crypto Currency price', "Currency price failed");
      });
    }
  }
};
