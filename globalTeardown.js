const fs = require('fs');
const { sendEmailReport, sendLineNotify } = require('./reporter');  // Assuming these functions are imported
const reportPath = './playwright-report/test-results.json';

// Function to wait for the test report file to be fully written
async function waitForReportFile() {
  return new Promise((resolve, reject) => {
    const timeout = 60000; // Maximum time to wait for the file (60 seconds)
    const checkInterval = 1000; // Check every 1 second

    let lastSize = 0; // To track the file size and detect when it stops updating
    const checkFileExistence = setInterval(() => {
      // Check if the file exists
      if (fs.existsSync(reportPath)) {
        const stats = fs.statSync(reportPath);

        // Check if the file has changed size or is still updating
        if (stats.size !== lastSize) {
          lastSize = stats.size; // Update last size
        } else {
          // If the file size hasn't changed, we can assume it's fully written
          clearInterval(checkFileExistence);
          resolve(); // Report file is fully written, proceed
        }
      }
    }, checkInterval);

    setTimeout(() => {
      clearInterval(checkFileExistence);
      reject(new Error('Test report not found or was not generated in time.'));
    }, timeout); // Timeout after 60 seconds
  });
}

// Global teardown logic
module.exports = async () => {
  try {
    console.log('Waiting for the test report to be generated...');

    // Wait for the report file to be created (polling)
    await waitForReportFile();

    console.log('Report file found. Sending notifications...');

    // Send notifications after the report is fully written
    await sendLineNotify();
    await sendEmailReport();

  } catch (error) {
    console.error('Error occurred while sending notifications:', error);
  }
};
