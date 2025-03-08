# SSH Action for GitHub Actions

This action allows you to SSH into a GitHub Actions runner during workflow execution for debugging purposes.

## Features

- Automatically sets up SSH access on the runner
- Displays connection information (IP, username, and SSH command)
- Configurable timeout for SSH access
- Cleans up SSH configuration after workflow completion

## Usage

Add the following step to your workflow:

```yaml
- name: Setup SSH access
  uses: enescakir/ssh-action@v1
  with:
    public-ssh-key: ${{ secrets.SSH_PUBLIC_KEY }}
    wait-minutes: 30  # Optional, default is 10 minutes
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `public-ssh-key` | Your public SSH key (content of your `~/.ssh/id_rsa.pub` file) | Yes | |
| `wait-minutes` | How long to keep the SSH connection available (in minutes) | No | 10 |

## Outputs

| Output | Description |
|--------|-------------|
| `user` | The username to use for SSH connection |
| `ip` | The public IP address of the runner |

## Example Workflow

```yaml
name: Debug with SSH

on:
  workflow_dispatch:

jobs:
  debug:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup SSH access
        uses: enescakir/ssh-action@v1
        with:
          public-ssh-key: ${{ secrets.SSH_PUBLIC_KEY }}
          wait-minutes: 30
      
      # Your other steps here
      # The workflow will pause during the SSH session
```

## How to Connect

1. Add your public SSH key to your repository secrets as `SSH_PUBLIC_KEY`
2. Run the workflow
3. Use the SSH command displayed in the workflow logs to connect to the runner
4. The SSH session will be available for the specified duration (default: 10 minutes)

## Security Notes

- Only use this action for debugging purposes
- Never expose your private SSH key
- The SSH access will be automatically revoked after the specified timeout or when the workflow completes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```yaml
name: ci

jobs:
  build:
    runs-on: ubicloud-standard-2
    steps:
      - name: Checkout
        uses: actions/checkout@v4
    
      - name: Enable ssh for runner
        uses: ubicloud/ssh-debug@v1
        with:
          public-ssh-key: <YOUR_SSH_KEY>
```