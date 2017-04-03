'use strict';

const {STATUS, COMMAND, RETURN_MSG} = require('../StaticSource');
const Router = require('../Router');
const RedirectDisplayAddStudentCommander = require('./DisplayAddStudentCommander');
const RedirectDisplayQueryScoreCommander = require('./DisplayQueryScoreCommander');
const RedirectDisplayTerminateCommander = require('./DisplayTerminateCommander');

const ERROR_COMMAND_ROUTER = new Router(STATUS.COMMAND, RETURN_MSG.ERROR_COMMAND);

class MainCommander{

  constructor() {
    this.displayCommanders = new Map([
      [COMMAND.INPUT_STUDENT, new RedirectDisplayAddStudentCommander()],
      [COMMAND.INPUT_STUDENT_NUMBER, new RedirectDisplayQueryScoreCommander()],
      [COMMAND.CLOSE, new RedirectDisplayTerminateCommander()]
    ]);
  }

  exec(command) {
    return this.displayCommanders.has(command) ?
      this.displayCommanders.get(command).exec() :
      ERROR_COMMAND_ROUTER;
  }

}

module.exports = MainCommander;