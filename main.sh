#!/usr/bin/env bash

sudo mkdir /home/runner/.ssh
echo "aa" | sudo tee /home/runner/.ssh/authorized_keys >/dev/null
sudo chown -R runner:runner /home/runner/.ssh
sudo chmod 700 /home/runner/.ssh
sudo chmod 600 /home/runner/.ssh/authorized_keys
 