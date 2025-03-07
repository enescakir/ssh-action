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
    console.log('\nSSH Connection Information:');
    console.log(`User:    runner`);
    console.log(`IPv4:    ${ipv4}`);
    console.log(`Command: ssh runner@${ipv4}\n`);
    core.info(`You can connect your runner with the following command:\nssh runner@${ipv4}`)

    // Set outputs that can be used by other workflow steps
    core.setOutput('ip', ipv4);
    core.setOutput('user', 'runner');
    core.setOutput('command', `ssh runner@${ipv4}`);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();

