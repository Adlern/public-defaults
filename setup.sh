#!/bin/sh

set -euo pipefail


NEWUSER="noah"
PUBSSHKEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO4V6LlvglhLS4J3sEt++C9Iuc5bHS9yXvRyaOZRpQvE"

adduser --disabled-password --gecos "" "$NEWUSER"
usermod -aG sudo "$NEWUSER"

install -d -m 700 -o "$NEWUSER" -g "$NEWUSER" /home/"$NEWUSER"/.ssh

printf '%s\n' "$PUBSSHKEY" \
  | tee /home/"$NEWUSER"/.ssh/authorized_keys >/dev/null

chown "$NEWUSER:$NEWUSER" /home/"$NEWUSER"/.ssh/authorized_keys
chmod 600 /home/"$NEWUSER"/.ssh/authorized_keys


# HARDENING
cat >/etc/ssh/sshd_config.d/01-hardening.conf <<EOF
# Hardening
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
PermitRootLogin no
Protocol 2
AllowUsers $NEWUSER
EOF

#testen
sshd -t && systemctl reload ssh

# mac testen: ssh noah@adlern.com

apt update \
&& apt -y full-upgrade \
&& apt -y autoremove \
&& apt autoclean

apt install -y ufw
ufw allow 22/tcp
ufw --force enable
ufw status verbose

timedatectl set-timezone Europe/Berlin
timedatectl set-ntp true

hostnamectl set-hostname adler-vps

grep -q "127.0.1.1 myserver" /etc/hosts || printf "127.0.1.1 myserver\n" >> /etc/hosts

apt install -y unattended-upgrades
dpkg-reconfigure -fnoninteractive unattended-upgrades
systemctl enable --now unattended-upgrades

# Brute force protection
apt install -y fail2ban

systemctl enable --now fail2ban
fail2ban-client status sshd

# SWAP
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
sysctl vm.swappiness=10
echo 'vm.swappiness=10' > /etc/sysctl.d/99-swappiness.conf

# quick sanity checks
whoami
-v
ufw status
systemctl status ssh --no-pager --full

# reboot to pick up kernel updates (log back in as NEWUSER)
[ -f /var/run/reboot-required ] && reboot

# deployment

apt install -y python3 python3-venv git nginx

