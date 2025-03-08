const core = require('@actions/core');

async function post() {
  try {
    const waitMinutes = parseInt(core.getInput('wait-minutes'));

    core.info(`Waiting for ${waitMinutes} minutes to allow SSH access...`);

    const user = core.getState('ssh_user');
    const ipv4 = core.getState('ssh_ip');

    core.info('\nSSH Connection Information:');
    core.info(`User:    ${user}`);
    core.info(`IPv4:    ${ipv4}`);
    core.info(`Command:\nssh ${user}@${ipv4}\n`);

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
