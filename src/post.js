const core = require('@actions/core');

async function post() {
  try {
    const waitMinutes = parseInt(core.getInput('wait-minutes'));

    core.info(`Waiting for ${waitMinutes} minutes to allow SSH access...`);

    // Set up signal handlers for job cancellation
    const signalHandler = async () => {
      core.info('Job cancellation detected. Cancelling wait early...');
      process.exit(0); // Exit gracefully
    };
    
    // Listen for termination signals
    process.on('SIGINT', signalHandler);
    process.on('SIGTERM', signalHandler);

    // Sleep in intervals instead of in one long block.
    // When it sleeps for a long block, it can't catch signals
    const intervalSeconds = 5
    for (let seconds = waitMinutes * 60; seconds > 0; ) {
      await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
      seconds -= intervalSeconds
    }
  } catch (error) {
    core.setFailed(`Post action failed with error: ${error.message}`);
  }
}

post();
