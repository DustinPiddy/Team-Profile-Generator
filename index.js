const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

const teamMembers = [];
const idArray = [];

function appMenu() {
  function createManager() {
    console.log("Build your team");
    inquirer
      .prompt([
        {
          type: "input",
          name: "managerName",
          message: "Manager name?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            }
            return "At least one character.";
          },
        },
        {
          type: "input",
          name: "managerId",
          message: "Manager id?",
          validate: (answer) => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              return true;
            }
            return "Enter number above 0.";
          },
        },
        {
          type: "input",
          name: "managerEmail",
          message: "Manager email?",
          validate: (answer) => {
            const pass = answer.match(/\S+@\S+\.\S+/);
            if (pass) {
              return true;
            }
            return "Invalid email.";
          },
        },
        {
          type: "input",
          name: "managerOfficeNumber",
          message: "Manager office number?",
          validate: (answer) => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              return true;
            }
            return "Enter number above 0.";
          },
        },
      ])
      .then((answers) => {
        const manager = new Manager(
          answers.managerName,
          answers.managerId,
          answers.managerEmail,
          answers.managerOfficeNumber
        );
        teamMembers.push(manager);
        idArray.push(answers.managerId);
        createTeam();
      });
  }

  function createTeam() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "memberChoice",
          message: "What team member would you like to add?",
          choices: [
            "Engineer",
            "Intern",
            "I don't want to add any more.",
          ],
        },
      ])
      .then((userChoice) => {
        switch (userChoice.memberChoice) {
          case "Engineer":
            addEngineer();
            break;
          case "Intern":
            addIntern();
            break;
          default:
            buildTeam();
        }
      });
  }

  function addEngineer() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "engineerName",
          message: "Engineer name?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            }
            return "At least one character.";
          },
        },
        {
          type: "input",
          name: "engineerId",
          message: "Engineer id?",
          validate: (answer) => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              if (idArray.includes(answer)) {
                return "ID Taken.";
              } else {
                return true;
              }
            }
            return "Enter number above 0.";
          },
        },
        {
          type: "input",
          name: "engineerEmail",
          message: "Engineer email?",
          validate: (answer) => {
            const pass = answer.match(/\S+@\S+\.\S+/);
            if (pass) {
              return true;
            }
            return "Email invalid.";
          },
        },
        {
          type: "input",
          name: "engineerGithub",
          message: "Engineer GitHub username?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            }
            return "At least one character.";
          },
        },
      ])
      .then((answers) => {
        const engineer = new Engineer(
          answers.engineerName,
          answers.engineerId,
          answers.engineerEmail,
          answers.engineerGithub
        );
        teamMembers.push(engineer);
        idArray.push(answers.engineerId);
        createTeam();
      });
  }

  function addIntern() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "internName",
          message: "Intern name?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            }
            return "At least one character.";
          },
        },
        {
          type: "input",
          name: "internId",
          message: "Intern id?",
          validate: (answer) => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              if (idArray.includes(answer)) {
                return "ID taken.";
              } else {
                return true;
              }
            }
            return "Enter number above 0.";
          },
        },
        {
          type: "input",
          name: "internEmail",
          message: "Intern email?",
          validate: (answer) => {
            const pass = answer.match(/\S+@\S+\.\S+/);
            if (pass) {
              return true;
            }
            return "Invalid Email.";
          },
        },
        {
          type: "input",
          name: "internSchool",
          message: "Intern's school?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            }
            return "At least one character.";
          },
        },
      ])
      .then((answers) => {
        const intern = new Intern(
          answers.internName,
          answers.internId,
          answers.internEmail,
          answers.internSchool
        );
        teamMembers.push(intern);
        idArray.push(answers.internId);
        createTeam();
      });
  }

  function buildTeam() {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }
    fs.writeFileSync(outputPath, render(teamMembers), "utf-8");
  }

  createManager();
}

appMenu();
