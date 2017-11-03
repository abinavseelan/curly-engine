const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = 1337;

app.use(bodyParser.json());
app.use(morgan('dev'));

async function getPageSource(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  return page.content();
}

app.get('/ping', (request, response) => {
  response.send('Pong');
});

app.get('/url/:url', (request, response) => {
  const { url } = request.params;

  if (!url) {
    response.status(400).send('noop');
  }

  getPageSource(`https://${url}`)
    .then((data) => {
      response.json({
        page: data,
      });
    });
});

app.listen(port, () => {
  console.log(`Curly Engine running on port ${port}`);
});
