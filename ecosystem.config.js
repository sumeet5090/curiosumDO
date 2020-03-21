const path = require('path')
const config = require('dotenv').config({path: path.join(__dirname, '.env')}).parsed
module.exports = {
  apps : [{
    name: 'curiosum_portal',
    script: 'yarn start',
    args: '',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production'
    },
    env_production: {
      NODE_ENV: 'production',
      ...config
    }
  }],

  deploy : {
    production : {
      key: '~/.ssh/id_rsa',
      user : 'root',
      host : '159.89.174.161',
      ref  : 'origin/master',
      repo : 'git@github.com:frozen4code/curiosum-tech-portal.git',
      path : '~/prod/mec_website',
      "forward-agent": true,
      'post-deploy' : 'yarn && yarn build && pm2 startOrRestart ecosystem.config.js --env production --update-env'
    }
  }
};