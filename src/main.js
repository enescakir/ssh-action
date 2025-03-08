const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    // Get inputs
    const sshKey = core.getInput('public-ssh-key', { required: true });
    
    // Create .ssh directory
    await exec.exec('sudo', ['mkdir', '-p', '/home/runner/.ssh']);
    
    // Add the SSH key to authorized_keys
    const authKeysPath = '/home/runner/.ssh/authorized_keys';
    await exec.exec('bash', ['-c', `echo "${sshKey}" | sudo tee ${authKeysPath} > /dev/null`]);
    
    // Set proper permissions
    await exec.exec('sudo', ['chown', '-R', 'runner:runner', '/home/runner/.ssh']);
    await exec.exec('sudo', ['chmod', '700', '/home/runner/.ssh']);
    await exec.exec('sudo', ['chmod', '600', authKeysPath]);
    
    // Get public IP address
    let ipv4 = '';
    const options = {
      listeners: {
        stdout: (data) => {
          ipv4 += data.toString().trim();
        }
      }
    };
    await exec.exec('curl', ['-sL', '--ipv4', 'ifconfig.me'], options);
    
    // Output connection information
    const user = 'runner';
    core.info('\nSSH Connection Information:');
    core.info(`User:    ${user}`);
    core.info(`IPv4:    ${ipv4}`);
    core.info(`Command:\nssh ${user}@${ipv4}\n`);

    // Save states that can be used by post action
    core.saveState('ssh_user', user)
    core.saveState('ssh_ip', ipv4)

    // Set outputs that can be used by other workflow steps
    core.setOutput('user', user);
    core.setOutput('ip', ipv4);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();

