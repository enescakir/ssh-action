# ssh-debug Action

Debug your GitHub Actions using SSH

## Usage

It puts ..

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