const core = require('@actions/core');

async function post() {
  try {
    const waitMinutes = parseInt(core.getInput('wait-minutes') || '10');

    // Calculate wait time in milliseconds
    const waitTimeMs = waitMinutes * 60 * 1000;

    console.log(`Waiting for ${waitMinutes} minutes to allow SSH access...`);
    
    // Sleep for the specified time
    await new Promise(resolve => setTimeout(resolve, waitTimeMs));
  } catch (error) {
    core.setFailed(`Post action failed with error: ${error.message}`);
  }
}

post();
