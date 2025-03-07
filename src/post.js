const core = require('@actions/core');
const exec = require('@actions/exec');

async function post() {
  try {
    const waitMinutes = parseInt(core.getInput('wait-minutes'));

    core.info(`Waiting for ${waitMinutes} minutes to allow SSH access...`);
    
    await exec.exec('sleep', [waitMinutes * 60]);

    // // Create a promise that can be canceled
    // let waitTimeout;
    // const waitPromise = new Promise(resolve => {
    //   waitTimeout = setTimeout(resolve, waitMinutes * 60 * 1000);
    // });

    // // Set up signal handlers for job cancellation
    // const signalHandler = async () => {
    //   core.info('Job cancellation detected. Cancelling wait early...');
    //   clearTimeout(waitTimeout); // Clear the timeout
    //   process.exit(0); // Exit gracefully
    // };
    
    // // Listen for termination signals
    // process.on('SIGINT', signalHandler);
    // process.on('SIGTERM', signalHandler);
    
    // // Wait for the timeout or until a signal is received
    // await waitPromise;
  } catch (error) {
    core.setFailed(`Post action failed with error: ${error.message}`);
  }
}

post();
