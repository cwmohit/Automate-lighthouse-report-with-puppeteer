import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import { URL } from 'url';
import nodemailer from 'nodemailer';
import { writeFile } from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--remote-debugging-port=9222'] // Required for Lighthouse to connect
  });

  const url = `${process.env.APP_WEBSITE}`;
  const port = new URL(browser.wsEndpoint()).port;

  // Run Lighthouse for mobile
  const { report: reportMobile } = await lighthouse(url, {
    port,
    output: 'html',
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false
    },
    emulatedUserAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/12.0 Mobile/15A372 Safari/604.1'
  });

  // Run Lighthouse for desktop
  const { report: reportDesktop } = await lighthouse(url, {
    port,
    output: 'html',
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    },
    emulatedUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
  });

  // Save the reports to files
  const reportPathMobile = './public/lighthouse-report-mobile.html';
  const reportPathDesktop = './public/lighthouse-report-desktop.html';
  await writeFile(reportPathMobile, reportMobile);
  await writeFile(reportPathDesktop, reportDesktop);

  // Close the browser
  await browser.close();

  // Set up Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
      user: `${process.env.APP_EMAIL}`,
      pass: `${process.env.APP_PASSWORD}`
    }
  });

  // Send the email with the reports
  const mailOptions = {
    from: `${process.env.APP_EMAIL}`,
    to: `${process.env.SEND_TO_EMAIL}`,
    subject: `Prod Lighthouse Reports [${process.env.APP_NAME}]`,
    text: `Please find the attached Lighthouse reports for mobile and desktop.\n\nThis is auto-generated email, Please do not reply.\n\nNote: This report is generated daily at 10.30 AM.\n\nAutomated Message: This email is automatically generated to provide you with the latest Lighthouse reports.`,
    attachments: [
      {
        filename: 'lighthouse-report-mobile.html',
        path: reportPathMobile
      },
      {
        filename: 'lighthouse-report-desktop.html',
        path: reportPathDesktop
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
  });
})();