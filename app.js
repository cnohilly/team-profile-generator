const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const writeFile = require('./utils/generate-file');

const render = require("./lib/htmlRenderer");

// directory and filename 
const dir = './output';
const fileName = 'team';


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// Questions to be asked for all employee types or roles
const basicQuestions = [
    {
        type: 'input',
        name: 'name',
        message: "What is the employee's name?"
    },
    {
        type: 'input',
        name: 'id',
        message: "What is the employee's id?"
    },
    {
        type: 'input',
        name: 'email',
        message: "What is the employee's email?"
    }
];

// duplicates basic questions and adds additional questions necessary for team members
// JSON parse and stringify used to make a deep copy of questions
employeeQuestions = [
    {
        type: 'list',
        name: 'role',
        message: "What is the employee's role?",
        choices: ['Engineer', 'Intern']
    }, ...JSON.parse(JSON.stringify(basicQuestions)),
    {
        type: 'input',
        name: 'school',
        message: "What is the intern's school?",
        when: (answers) => answers.role === 'Intern'
    },
    {
        type: 'input',
        name: 'github',
        message: "What is the engineer's Github name?",
        when: (answers) => answers.role === 'Engineer'
    },
    {
        type: 'confirm',
        name: 'addNew',
        message: "Would you like to add another employee?"
    }];

// duplicates basic questions and adds additional questions necessary for team manager
// JSON parse and stringify used to make a deep copy of questions
let managerQuestions = [...JSON.parse(JSON.stringify(basicQuestions)),
{
    type: 'input',
    name: 'officeNumber',
    message: "What is the manager's office number?"
}];
// replaces the word 'employee' with 'manager' for each question
managerQuestions.forEach(question => {
    question.message = question.message.replace('employee', 'manager');
});

// recursive function to get all the employees that the user wishes to add to their team list
const getEmployees = (questions, employees) => {
    // if the function does not have an employees parameter, it creates an empty array
    if (!employees) {
        employees = [];
        console.log(`
        ----------------------
        - Enter Team Manager -
        ----------------------
        `)
    } else {
        console.log(`
        -------------------------
        - Enter New Team Member -
        -------------------------
        `)
    }
    // returns the inquirer promise and loops through the questions passed in
    return inquirer.prompt(questions).then(data => {
        // switch to create the appropriate employee type
        switch (data.role) {
            case 'Intern':
                employees.push(new Intern(data.name, data.id, data.email, data.school));
                break;
            case 'Engineer':
                employees.push(new Engineer(data.name, data.id, data.email, data.github));
                break;
            default:
                employees.push(new Manager(data.name, data.id, data.email, data.officeNumber));
                break;
        }
        // if the user choose to add another member or this was the first entry for the manager, the function is called recursively
        if (data.addNew || !data.role) {
            return getEmployees(employeeQuestions, employees);
            // else the array of employees is returned
        } else {
            return employees;
        }
    });
};

// calls the function to prompt the user with inquirer, ensures the desired directory exists and if not creates it, then renders the html and writes it to the output file
// write file response is output for the user
getEmployees(managerQuestions).then(data => {
    return writeFile(dir, fileName, render(data));
}).then(writeFileResponse => {
    console.log(writeFileResponse.message);
}).catch(err => {
    console.log(err);
});

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
