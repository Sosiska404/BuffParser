import puppeteer from 'puppeteer';

async function getBuffSkinInfo(skinUrl) {
    const browser = await puppeteer.launch({
        headless: "new", // или false для видимости браузера
    });

    try {
        const page = await browser.newPage();
        await page.goto(skinUrl, { waitUntil: 'networkidle0' });

        // Ожидаем загрузки таблицы со скинами
       await page.waitForSelector('tbody.list_tb_csgo');

        const skinData = await page.$$eval(
            'tbody.list_tb_csgo',
            (skinCards) => {
                return skinCards.map(skinCard => {
                   const priceElement = skinCard.querySelector('strong.f_Strong');
                    const floatElement = skinCard.querySelector('div.wear-value');

                    return {
                        price: priceElement ? priceElement.textContent.trim() : null,
                        float: floatElement ? floatElement.textContent.trim() : null,
                    };
                 })
            }
         );
         if (skinData.length === 0) {
             console.warn(`Не удалось получить данные о скинах. Возможно, структура сайта изменилась.`);
        }
         return skinData
    } catch (error) {
        console.error('Произошла ошибка при получении информации о скинах:', error);
        return null;
    } finally {
        await browser.close();
    }
}
async function main() {
    const skinUrl = 'https://buff.163.com/goods/33960?from=market#tab=selling'; // Замените URL
   const skinInfo = await getBuffSkinInfo(skinUrl);

  if(skinInfo){
        if(skinInfo.length > 0) {
            console.log("Информация о скинах:");
            skinInfo.forEach((skin, index) => {
                console.log(`Скин ${index + 1}:`);
                console.log(` Цена: ${skin.price || 'неизвестно'}`);
                console.log(` Float: ${skin.float || 'неизвестно'}`);
                console.log('-------------------');
        });
        } else {
             console.log('Не удалось найти информацию о скинах.');
        }
  }
}
main();