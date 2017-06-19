#!/usr/bin/env bash

echo "Installing repo"
sudo yum install epel-release -y
sudo wget https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
sudo wget http://rpms.remirepo.net/enterprise/remi-release-7.rpm
sudo rpm -Uvh remi-release-7.rpm 
sudo rpm -Uvh epel-release-latest-7.noarch.rpm

echo "update / upgrade"
sudo yum update && sudo yum upgrade -y

echo "Installing base tool"
sudo yum install vim git curl wget gcc-c++ make unzip yum-utils -y

echo -e "Disabling SELinux."
setenforce 0
sed -i -e 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/sysconfig/selinux
sed -i -e 's/SELINUX=permissive/SELINUX=disabled/g' /etc/sysconfig/selinux

echo "Installing nginx"
sudo yum install nginx -y
sudo systemctl start nginx && sudo systemctl enable nginx

echo "Installing PHP && PHP-FPM"
sudo yum-config-manager --enable remi-php71
sudo yum --enablerepo=remi-php71 install php php-fpm -y
sudo systemctl start php-fpm && sudo systemctl enable php-fpm

echo "Installing PHP extensions"
sudo yum --enablerepo=remi-php71 install php-mysql php-gd php-imap php-ldap php-mbstring php-odbc php-pear php-xml php-xmlrpc php-devel php-cli php-pdo php-mcrypt php-pecl-apc php-pecl-xdebug graphviz gettext -y

echo "Installing MySQL"
sudo yum localinstall https://dev.mysql.com/get/mysql57-community-release-el7-8.noarch.rpm -y
sudo yum install mysql-community-server -y
sudo systemctl enable mysqld && sudo systemctl start mysqld

echo "Resetting MySQL root password"
oldpass=$( grep 'temporary.*root@localhost' /var/log/mysqld.log | tail -n 1 |  sed 's/.*root@localhost: //' )
newpass="MyNewPass4!" 
sudo mysqladmin -u root --password=${oldpass} password $newpass 

echo "Installing Composer"
sudo curl -s https://getcomposer.org/installer | php
sudo mv composer.phar /usr/bin/composer

echo "Installing Nodejs"
sudo curl --silent --location https://rpm.nodesource.com/setup_7.x | bash -
sudo yum -y install nodejs

echo "Configuring Nginx"
sudo mkdir -p /etc/nginx/sites-{available,enabled}
