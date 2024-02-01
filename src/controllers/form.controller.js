const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const { authService, userService, tokenService, emailService } = require('../services');

// async 함수를 사용할 때 오류를 처리하는 래퍼 함수
const catchAsyncWrapper = (asyncFn) => {
  return (req, res, next) => {
    asyncFn(req, res, next).catch((err) => next(err));
  };
};

const giveMeImageHtml = async (link) => {
  // Puppeteer 실행 시 오류 해결을 위해 headless 설정 추가
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(link);
  await page.waitForTimeout(1000);
  const htmlContent = await page.content();
  await browser.close();
  return htmlContent;
};

// 기존의 catchAsync 함수를 새로운 래퍼 함수로 대체
const create = catchAsyncWrapper(async (req, res) => {
  try {
    const html = await giveMeImageHtml(req.body.link);
    const $ = cheerio.load(html);
    const firstImage = $('meta[property="og:image"]').attr('content');
    res.status(httpStatus.CREATED).send({ firstImage });
  } catch (error) {
    // 비동기 함수에서 발생한 오류 처리
    console.error('Async function error:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
  }
});

module.exports = {
  create,
};