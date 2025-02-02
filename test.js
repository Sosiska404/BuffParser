import puppeteer from 'puppeteer';

async function getYoutubeChannelVideos(channelUrl) {
  const browser = await puppeteer.launch({
    headless: "new", // или false для видимого браузера
  });
  try {
    const page = await browser.newPage();
    await page.goto(channelUrl + '/videos', { waitUntil: 'networkidle0' });

    // Ожидаем, пока загрузятся элементы списка видео
    await page.waitForSelector('#contents > ytd-rich-item-renderer');

    const videoTitles = await page.$$eval(
      '#contents > ytd-rich-item-renderer a#video-title',
       els => els.map(el => el.title)
     );
      if(videoTitles.length === 0) {
         console.warn(`Не удалось найти видео на канале ${channelUrl}. Возможно, структура страницы изменилась.`);
      }
      return videoTitles
  } catch (error) {
    console.error(`Произошла ошибка при получении видео с канала ${channelUrl}:`, error);
    return null;
  } finally {
    await browser.close();
  }
}

async function main() {
    const channelUrl = "https://www.youtube.com/@VladilenMinin"; // Замените на URL нужного канала
    const videos = await getYoutubeChannelVideos(channelUrl);

    if (videos) {
      if (videos.length > 0) {
        console.log(`Видео с канала: ${channelUrl}`);
          videos.forEach((title, i) => {
            console.log(`${i+1}. Название: ${title}`);
            console.log('---------');
        });
      } else {
        console.log(`На канале ${channelUrl} нет видео.`);
      }
    }
}

main();