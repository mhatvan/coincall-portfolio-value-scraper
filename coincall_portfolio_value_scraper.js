const puppeteer = require('puppeteer');
const {
  WebClient
} = require('@slack/client');
const credentials = require('./credentials');

main();

async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://coincall.io/');
    await page.setViewport({
      width: 1920,
      height: 1080
    })

    await page.click('body > div.body-wrapper > div.upper-menu > div > div > div.col-7.text-right.nav-menu > a.btn.btn-link');
    await page.waitFor(2000);

    await page.type('#id_email_login', 'insert email here');
    await page.type('#id_password_login', 'insert password here');
    await page.click('#signInModal > div > div.modal-content > div > div.col-12.col-md-6.auth-form-modal.text-center > form > div:nth-child(4) > button');

    await page.waitFor(5000);

    const portfolioValue = await page.evaluate(() => {
      return document.querySelector('#indexPageApp > div > div.card > div > div.row.coin-list-options.sticky.flex > div.col-12.col-md-9.coinfolio-value-col.flex-md-first.flex > div.flex.align-items-center > div > span:nth-child(1)').innerText;
    })

    const slackChannel = credentials.slackChannel;
    const slackToken = credentials.slackToken;
    const slackMessage = 'current Coincall.io portfolio value equals: ' + portfolioValue + '! :moneybag: :rocket:';
    const web = new WebClient(slackToken);

    await web.chat.postMessage(slackChannel, slackMessage, {
      'username': 'Coincall.io Portfolio Value Bot',
      'as_user': false
    })

    await browser.close();

  } catch (error) {
    console.error(error);
  }
}