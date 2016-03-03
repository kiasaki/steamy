echo "Install steamy and it's dependencies..."

apt-get update

# Postgres
echo "Installing postgres..."
apt-get install postgresql postgresql-contrib

sudo -u postgres psql -c "CREATE ROLE \"steamy\" WITH SUPERUSER LOGIN PASSWORD 'steamy';"
sudo -u postgres psql -c "CREATE DATABASE \"steamy\" WITH OWNER \"steamy\";"

# Folders
mkdir -p /var/steamy
mkdir -p /var/steamy/builds
mkdir -p /var/steamy/logs

# Config
echo "Installing config..."
cp /home/vagrant/steamy/example-app/support/demo-steamy-agent.conf /etc/steamy-agent.conf
cp /home/vagrant/steamy/example-app/support/demo-nginx-site.conf /etc/nginx/sites-enabled/steamy.conf
cp /home/vagrant/steamy/example-app/support/demo-bashrc /home/vagrant/.bashrc
chmod +x /home/vagrant/.bashrc

# Install steamy
echo "Installing steamy..."
curl -o /usr/local/bin/steamy https://github.com/kiasaki/steamy/release/...
chmod +x /usr/local/bin/steamy

# Install steamy-agent
echo "Installing steamy-agent..."
curl -o /usr/local/bin/steamy https://github.com/kiasaki/steamy/release/...
chmod +x /usr/local/bin/steamy-agent https://github.com/kiasaki/steamy

# Install steamy-ui
echo "Installing steamy-ui..."
curl -o /var/www/steamy.tar.gz https://github.com/kiasaki/steamy/release/...
cd /var/www || exit 1
tar -xzf steamy.tar.gz


