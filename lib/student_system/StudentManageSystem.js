'use strict';

const Subject = require('./Subject');
const Student = require('./Student');
const Class = require('./Clazz');

const ADD_STUDENT = 'ADD_STUDENT';
const QUERY_SCORE = 'QUERY_SCORE';
const CLOSED = 'CLOSED';
const COMMAND = 'COMMAND';
const INPUT_STUDENT = '1';
const INPUT_STUDENT_NUMBER = '2';
const CLOSE = '3';

const WELCOME = `欢迎来到学生成绩控制台记录系统  Powered By Melo Gao`;
const COMMAND_MSG = `请输入命令:
1.添加学生
2.生成成绩单
3.退出`;
const ADD_STUDENT_MSG = '请输入学生信息:(姓名,学号,民族,班级,数学:成绩,语文:成绩,英语:成绩,编程:成绩)';
const QUERY_SCORE_MSG = '请输入要打印的学生学号:(学号,学号...)';
const GOODBYE = `see you`;
const ERROR_COMMAND_MSG = '指令错误! ';
const ERROR_STUDENT_STR_MSG = '请按正确的格式输入! ';
const EMPTY_STR = '';

class StudentManageSystem {

  constructor(readline) {
    this.classes = [];
    this.consoleState = COMMAND;
    this.readline = readline;
  }

  parseCommand(input) {
    switch (input) {
      case INPUT_STUDENT:
        this.consoleState = ADD_STUDENT;
        return EMPTY_STR;
      case INPUT_STUDENT_NUMBER:
        this.consoleState = QUERY_SCORE;
        return EMPTY_STR;
      case CLOSE:
        this.consoleState = CLOSED;
        this.readline.close();
        return EMPTY_STR;
      default:
        return ERROR_COMMAND_MSG;
    }
  }

  parseInput(input) {
    let msg;
    switch (this.consoleState) {
      case COMMAND:
        msg = this.parseCommand(input);
        break;
      case ADD_STUDENT:
        msg = this.addStudent(input);
        break;
      case QUERY_SCORE:
        msg = this.queryScores(input);
        break;
    }
    this.printMsg(msg);
  }

  queryScores(studentNumbersStr) {
    const studentNumbers = studentNumbersStr.split(',');
    const classesInfo = this.getClassesInfo(studentNumbers);
    const scoresString = this.transScoreFormToString(classesInfo);
    console.log(scoresString);
    this.consoleState = COMMAND;
    return EMPTY_STR;
  }

  addStudent(studentStr) {
    const student = this.getStudentInfo(studentStr);
    if (student) {
      this.updateClasses(student);
      this.consoleState = COMMAND;
      return EMPTY_STR;
    } else {
      return ERROR_STUDENT_STR_MSG;
    }
  }

  getStudentInfo(stuStr) {
    try {
      const createSubject = (mathStr, chineseStr, englishStr, programStr) => {
        const getSubjectScore = (scoreStr) => {
          return parseFloat(scoreStr.split(':')[1]);
        };
        const math = getSubjectScore(mathStr);
        const chinese = getSubjectScore(chineseStr);
        const english = getSubjectScore(englishStr);
        const program = getSubjectScore(programStr);
        return new Subject(math, chinese, english, program);
      };
      const [name, stuNumber, nation, classNum, mathStr, chineseStr, englishStr, programStr] = stuStr.split(',');
      const subject = createSubject(mathStr, chineseStr, englishStr, programStr);
      return new Student(name, stuNumber, nation, classNum, subject);
    } catch (e) {
      return null;
    }
  }

  updateClasses(student) {
    let exitedClazz = this.classes.find(clazz => clazz.classNumber === student.classNumber);
    if (exitedClazz) {
      exitedClazz.addStudentAndUpdateScores(student);
    } else {
      let clazz = new Class(student.classNumber);
      clazz.addStudentAndUpdateScores(student);
      this.classes.push(clazz);
    }
    return this.classes;
  }

  getClassesInfo(stuNumbers) {
    return this.classes
      .map(clazzInSystem => {
        const students = clazzInSystem.students.filter(student => stuNumbers.indexOf(student.stuNumber) !== -1);
        if (!students) return null;
        return this.createQueryClass(clazzInSystem, students);
      })
      .filter(queryClazz => queryClazz);
  }

  createQueryClass(clazzInSystem, students) {
    let resultClass = new Class(clazzInSystem.classNumber);
    students.forEach(student => resultClass.addStudent(student));
    resultClass.median = clazzInSystem.median;
    resultClass.average = clazzInSystem.average;
    return resultClass;
  }

  transScoreFormToString(classes) {
    let resultString = ``;
    classes.forEach(clazz => {
      resultString += `成绩单
姓名|数学|语文|英语|编程|平均分|总分
==================\n`;
      clazz.students.forEach(student => {
        const subject = student.subject;
        resultString += `${student.name}|${subject.math}|${subject.chinese}|${subject.english}|${subject.program}|${student.average}|${student.total}\n`;
      });
      resultString += `==================
全班总成绩平均分:${clazz.average}
全班总成绩中位数:${clazz.median}\n`;
    });
    return resultString;
  }

  static printWELCOME() {
    console.log(WELCOME);
  }

  static printCommand(msg) {
    if (msg) {
      console.log(msg + COMMAND_MSG);
    } else {
      console.log(COMMAND_MSG);
    }
  }

  static printAddStudent(error_msg) {
    if(error_msg) {
      console.log(error_msg + ADD_STUDENT_MSG);
    } else {
      console.log(ADD_STUDENT_MSG);
    }
  }

  static printQueryScore() {
    console.log(QUERY_SCORE_MSG)
  }

  static printGoodBye() {
    console.log(GOODBYE)
  }

  printMsg(msg) {
    switch (this.consoleState) {
      case COMMAND:
        StudentManageSystem.printCommand(msg);
        break;
      case ADD_STUDENT:
        StudentManageSystem.printAddStudent(msg);
        break;
      case QUERY_SCORE:
        StudentManageSystem.printQueryScore();
        break;
      case CLOSED:
        StudentManageSystem.printGoodBye();
        break;
    }
  }
}

module.exports = StudentManageSystem;
