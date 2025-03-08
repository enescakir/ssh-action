const core = require('@actions/core');

async function post() {
  try {
    const waitMinutes = parseInt(core.getInput('wait-minutes'));

    core.info(`Waiting for ${waitMinutes} minutes to allow SSH access...`);

    // Set up signal handlers for job cancellation
    const signalHandler = async () => {
      core.info('Job cancellation detected. Exiting...');
      process.exit(0); // Exit gracefully
    };
    
    // Listen for termination signals
    process.on('SIGINT', signalHandler);
    process.on('SIGTERM', signalHandler);

    // Wait for the timeout or until a signal is received
    await new Promise(resolve => setTimeout(resolve, waitMinutes * 60 * 1000));

  } catch (error) {
    core.setFailed(`Post action failed with error: ${error.message}`);
  }
}

post();
