'use strict';

const Router = require('../Router');
const {STATUS, RETURN_MSG} = require('../StaticSource');

class DisplayTerminateCommander{
  exec() {
    return new Router(STATUS.CLOSED, RETURN_MSG.GOODBYE);
  }
}

module.exports = DisplayTerminateCommander;