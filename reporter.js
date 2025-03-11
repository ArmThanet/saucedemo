const fs = require('fs');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

// Path to the test results JSON file
const reportPath = './playwright-report/test-results.json';

// Function to send the test results by email
async function sendEmailReport() {
  // Create the transporter for nodemailer
  let transporter = nodemailer.createTransport({
    service: 'gmail',  // or any other service you use
    auth: {
      user: process.env.EMAIL_USER,  // Your email address
      pass: process.env.EMAIL_PASS,  // Your email password or app password
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // The recipient's email
    subject: 'Playwright Test Status Report',
    text: await generateReportMessage(),  // Email body with test results
  };

  try {
    // Try sending the email
    console.log('Sending email...');
    await transporter.sendMail(mailOptions);
    console.log('📧 Email Report Sent!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Function to check the test status and log results
function checkTestStatus() {
  // Read and parse the JSON report
  const jsonReport = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf-8')) : null;

  if (!jsonReport) {
    console.log('Test report not found!');
    return;
  }

  // Loop through suites to check test results
  jsonReport.suites.forEach(suite => {
    suite.suites.forEach(innerSuite => {
      innerSuite.specs.forEach(test => {
        const testStatus = (test.tests && test.tests.length > 0 && test.tests[0].results && test.tests[0].results.length > 0)
          ? test.tests[0].results[0].status
          : 'Unknown'; // Default to 'Unknown' if no result is found

        const testTitle = test.title;

        // Log the result of the test based on the 'test.tests[0].results[0].status'
        if (testStatus === 'passed') {
          console.log(`${testTitle}: ✅ Passed`);
        } else if (testStatus === 'failed') {
          console.log(`${testTitle}: ❌ Failed`);
        } else {
          console.log(`${testTitle}: Status Unknown`);
        }
      });
    });
  });
}

async function generateReportMessage() {
  // Check if the report file exists and read it asynchronously
  let jsonReport;
  try {
    jsonReport = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf-8')) : null;
  } catch (error) {
    console.error('Error reading or parsing the report file:', error);
    return 'Error reading the test report!';
  }

  // If the report doesn't exist, return an appropriate message
  if (!jsonReport) {
    console.log('Test report not found!');
    return 'Test report not found!';
  }

  let statusMessage = 'Playwright Test Results:\n\n';

  // Loop through all suites and tests to generate the report message
  jsonReport.suites.forEach(suite => {
    suite.suites.forEach(innerSuite => {
      innerSuite.specs.forEach(test => {
        const testTitle = test.title;
        const testStatus = getTestStatus(test);
        const testErrors = getTestErrors(test);

        // Append the status and any errors (if present) to the status message
        statusMessage += formatTestMessage(testTitle, testStatus, testErrors);
      });
    });
  });

  return statusMessage;
}

// Helper function to extract test status
function getTestStatus(test) {
  const testResults = test.tests && test.tests[0] && test.tests[0].results;
  return (testResults && testResults.length > 0) ? testResults[0].status : 'Unknown';
}

// Helper function to extract test errors
function getTestErrors(test) {
  const testResults = test.tests && test.tests[0] && test.tests[0].results;
  return (testResults && testResults.length > 0 && testResults[0].errors) || [];
}

// Helper function to format the message for each test
function formatTestMessage(testTitle, testStatus, testErrors) {
  const statusIcon = testStatus === 'passed' ? '✅' : '❌';
  let message = `${testTitle}: ${statusIcon} ${testStatus}`;

  if (testErrors.length > 0) {
    message += ` - Errors: ${testErrors.join(', ')}`;
  }

  message += '\n';
  return message;
}

// Function to send the LINE Notify message
async function sendLineNotify() {
  const statusMessage = await generateReportMessage();

  // Send the notification via LINE Notify
  try {
    const response = await axios.post(
      'https://notify-api.line.me/api/notify',
      `message=${encodeURIComponent(statusMessage)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LINE_TOKEN}`, // Your LINE Notify token
        },
      }
    );
    console.log('Response from LINE Notify:', response.data);
    console.log('📱 Line notification sent successfully!');
  } catch (error) {
    console.error('Error sending Line notification:', error.response ? error.response.data : error.message);
  }
}

// Export the functions so they can be used in other parts of the program
module.exports = { generateReportMessage, sendEmailReport, sendLineNotify };
