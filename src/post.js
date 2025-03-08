const core = require('@actions/core');

async function post() {
  try {
    const waitMinutes = parseInt(core.getInput('wait-minutes'));

    core.info(`Waiting for ${waitMinutes} minutes to allow SSH access...`);
    
    // Create a promise that can be canceled
    // let waitTimeout;
    // const waitPromise = new Promise(resolve => {
    //   waitTimeout = setTimeout(resolve, waitMinutes * 60 * 1000);
    // });

    // // Set up signal handlers for job cancellation
    // const signalHandler = async () => {
    //   console.log("test")
    //   core.info('Job cancellation detected. Cancelling wait early...');
    //   clearTimeout(waitTimeout); // Clear the timeout
    //   process.exit(0); // Exit gracefully
    // };
    
    // Listen for termination signals
    // process.on('SIGINT', signalHandler);
    // process.on('SIGTERM', signalHandler);
    process.on('SIGINT', () => {
      console.log('Received SIGINT');
    });
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM');
    });
    process.on('exit', () => {
      console.log('Received exit');
    });

    await new Promise(resolve => setTimeout(resolve, waitMinutes * 60 * 1000));
    // Wait for the timeout or until a signal is received
    // await waitPromise;

  } catch (error) {
    core.setFailed(`Post action failed with error: ${error.message}`);
  }
}

post();
