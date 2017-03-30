'use strict';

const Subject = require('./Subject');
const Student = require('./Student');
const Class = require('./Class');

const ADD_STUDENT = 'ADD_STUDENT';
const COMMAND = 'COMMAND';
const INPUT_STUDENT = '1';

class System {
  static getStudentInfo(stuStr) {
    return resolveStudentInput(stuStr);
  }
  constructor() {
    this.classes = [];
    this.consoleState = COMMAND;
  }
  parseInput(input) {
    const parseCommand = (input) => {
      if(input === INPUT_STUDENT) {
        this.consoleState = ADD_STUDENT;
      }
    };
    if(this.consoleState === COMMAND) {
      parseCommand(input);
    } else if(this.consoleState === ADD_STUDENT) {
      const student = System.getStudentInfo(input);
      this.updateClasses(student);
      this.consoleState = COMMAND;
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
  parseStuNumInput(stuNumStr) {
    return stuNumStr.split(',').map(numStr => parseInt(numStr));
  }
  getClassesInfo(stuNumbers) {
    let resultClasses = [];
    for (let stuNumber of stuNumbers) {
      for (let clazzInSystem of this.classes) {
        for (let student of clazzInSystem.students) {
          if (student.stuNumber === stuNumber) {
            let addClazz = resultClasses.find(clazz => clazz.classNumber === student.classNumber);
            if (addClazz) {
              addClazz.addStudent(student);
            } else {
              const exitClazz = this.classes.find(clazz => student.classNumber === clazz.classNumber);
              let clazz = new Class(student.classNumber);
              clazz.addStudent(student);
              clazz.median = exitClazz.median;
              clazz.average = exitClazz.average;
              resultClasses.push(clazz);
            }
          }
        }
      }
    }
    return resultClasses;
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
}

const resolveStudentInput = (stuStr) => {
  const resolveSubjectInput = (mathStr, chineseStr, englishStr, programStr) => {
    const getSubjectScore = (scoreStr) => {
      return parseFloat(scoreStr.split(':')[1]);
    };
    const math = getSubjectScore(mathStr);
    const chinese = getSubjectScore(chineseStr);
    const english = getSubjectScore(englishStr);
    const program = getSubjectScore(programStr);
    return new Subject(math, chinese, english, program);
  };
  const [name, stuNumStr, nation, classNumStr, mathStr, chineseStr, englishStr, programStr] = stuStr.split(',');
  const stuNumber = parseInt(stuNumStr);
  const classNum = parseInt(classNumStr);
  const subject = resolveSubjectInput(mathStr, chineseStr, englishStr, programStr);
  return new Student(name, stuNumber, nation, classNum, subject);
};


module.exports = System;