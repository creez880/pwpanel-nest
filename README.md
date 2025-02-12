<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
<p align="center">NestJS</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive Node.js framework for building efficient and scalable server-side applications.</p>
 
## Description
PW-Panel is an administration panel designed specifically for managing and maintaining a Perfect World server.

## Prerequisite

MariaDB installed and configured. Add the database details into the environment variables file. (See Environment variables section)

## Packages needed:

- node
- npm

## Installing on server

```bash
# Update Packages
$ sudo apt update && sudo apt upgrade -y

# Install Node.js & npm
$ curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
$ sudo apt install -y nodejs

# Verify install with:
$ node -v
$ npm -v

# To keep your NestJS application running even after server reboots, install PM2:
$ npm install -g pm2

# Navigate to the directory where you want to put it on the server
$ cd /path/to/your/project/dir

# Optional if git is not installed
$ sudo apt update
$ sudo apt install git -y

# Verify Installation
$ git --version

# Clone git repository
$ git clone https://github.com/creez880/pwpanel-nest.git

# Install node modules of the project
$ cd pwpanel-nest/
$ npm install

################# ENVIRONMENT VARIABLES #################
# Setting environment variables system-wide for all users
# First check if the env variable exists already
# If the variable is set, it will display the value.
# If it is not set, it will return an empty line.
$ echo $JWT_SECRET

# Open the environment file with vi or whatever editor you want
$ vi /etc/environment

#Add a separate line in this file, save and close file
$ JWT_SECRET="something-very-secret"

#Apply the changes
$ source /etc/environment

# Check again if the env variable was applied
$ echo $JWT_SECRET
################# ENVIRONMENT VARIABLES #################

# When the application starts it will first trigger the migrations

# NOT FINISHED YET!!
#TBA:
# - docs about starting the application with pm2
# - eventually firewall and reverse proxy docs (if needed)

```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# build project
$ nest build

# development - also runs the migrations
$ npm run start

# watch mode - also runs the migrations
$ npm run start:dev

# production mode - also runs the migrations
$ npm run start:prod
```
