import puppeteer from 'puppeteer';

async function getBinanceP2pUsdtPrices() {
  const browser = await puppeteer.launch({
    headless: "new" // или false для видимости браузера
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://p2p.binance.com/ru/trade/all-payments/USDT?fiat=USD', { waitUntil: 'networkidle2' });


    await page.waitForSelector('tbody.bn-web-table-tbody');

    const prices = await page.$$eval('tbody.bn-web-table-tbody', elements => {
        return elements.map(el => {
             const priceElement = el.querySelector('div.text-primaryText');
             return priceElement ? priceElement.textContent.trim() : null
            })
       });
        const filteredPrices = prices.filter(price => price !== null);

    if(filteredPrices.length === 0){
        console.warn("Не удалось получить цены. Возможно, структура сайта изменилась.");
    }

    return filteredPrices
  } catch (error) {
    console.error('Произошла ошибка при получении цен с Binance:', error);
      return null;
  } finally {
    await browser.close();
  }
}

async function main() {
  const prices = await getBinanceP2pUsdtPrices();

    if (prices){
        if(prices.length > 0){
            console.log("Цены USDT/USD на Binance P2P:");
            prices.forEach((price, index) => {
                console.log(`${index + 1}. ${price} USD`);
                console.log('----------');
          });
        } else {
            console.log('Не удалось получить цены');
        }
    }
}

main();