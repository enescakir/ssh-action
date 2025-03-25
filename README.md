# ssh-runner

This action allows you to SSH into a [managed Ubicloud runner](https://www.ubicloud.com/use-cases/github-actions) during workflow execution for debugging purposes.

## Features

- Automatically sets up SSH access on the runner
- Displays connection information
- Keep the runner available for the configured minutes

## Usage

Add the following step to your workflow as the first step:

```yaml
- name: Setup SSH access
  uses: ubicloud/ssh-runner@v1
  with:
    public-ssh-key: ${{ secrets.SSH_PUBLIC_KEY }}
    wait-minutes: 30  # Optional, default is 10 minutes
```

## Inputs

| Input             | Description                                       | Required | Default |
|------------------|----------------------------------------------------|----------|---------|
| `public-ssh-key` | Your public SSH key                                | Yes      |         |
| `wait-minutes`   | How long to keep the runner available (in minutes) | No       | 10      |

## Outputs

| Output | Description                            |
|--------|----------------------------------------|
| `user` | The username to use for SSH connection |
| `ip`   | The public IP address of the runner    |

## Example Workflow

```yaml
name: Debug with SSH

on:
  workflow_dispatch:

jobs:
  debug:
    runs-on: ubicloud-standard-4
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup SSH access
        uses: ubicloud/ssh-runner@v1
        with:
          public-ssh-key: ${{ secrets.SSH_PUBLIC_KEY }}
          wait-minutes: 30
      
      # Your other steps here
      # The workflow will wait for the configured minutes after running all steps
```

Output:
```
Waiting for 10 minutes to allow SSH access...

SSH Connection Information:
User:    runner
IPv4:    188.40.199.63
Command:
ssh runner@188.40.199.63
```

You can use the SSH command displayed in the workflow logs to connect to the runner.

You can set up SSH access only for failed jobs.

```yaml
      - name: Setup SSH access
        if: ${{ failure() }}
        uses: ubicloud/ssh-runner@v1
        with:
          public-ssh-key: ${{ secrets.SSH_PUBLIC_KEY }}
          wait-minutes: 30

```

## Security Notes

- Only use this action for debugging purposes
- Never expose your private SSH key
- The runner will be automatically destroyed after the specified wait minutes or when the workflow completes

## License

This project is licensed under the MIT License - see the LICENSE file for details.
