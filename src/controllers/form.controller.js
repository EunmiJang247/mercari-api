const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const { authService, userService, tokenService, emailService } = require('../services');

const giveMeImageHtml = async (link) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);
  await page.waitForTimeout(1000);
  const htmlContent = await page.content();
  await browser.close();
  return htmlContent;
}
const create = catchAsync(async (req, res) => {

  const html = await giveMeImageHtml(req.body.link);
  const $ = cheerio.load(html);
  const firstImage = $('meta[property="og:image"]').attr('content');
  res.status(httpStatus.CREATED).send({ firstImage });
});

module.exports = {
  create,
};
