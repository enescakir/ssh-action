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

    const events = [
      // Standard process events
      'beforeExit',
      'exit',
      'uncaughtException',
      'unhandledRejection',
      'SIGINT',
      'SIGTERM',
      'SIGUSR1',
      'SIGUSR2',
      'SIGHUP'
    ];

    // Register handlers for all events
    events.forEach(event => {
      process.on(event, (...args) => {
        console.log(`[${(new Date()).toISOString()}] Received event: ${event}`, args);
      });
    });

    await new Promise(resolve => setTimeout(resolve, waitMinutes * 60 * 1000));
    // Wait for the timeout or until a signal is received
    // await waitPromise;

  } catch (error) {
    core.setFailed(`Post action failed with error: ${error.message}`);
  }
}

post();
