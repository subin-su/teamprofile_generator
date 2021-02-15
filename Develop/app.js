const inquirer = require("inquirer");
const fs = require("fs");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");

const employees = [];

function initApp() {
    startHtml();
    addMember();
}

function addMember() {
    inquirer.prompt([{
        type:"input",
        message: "Enter team member's name",
        name: "name",
        validate:function(userName){
            var done = this.async();
            setTimeout(function(){
                if(userName===""){
                    done('You need to provide Name:')
                    return;
                }
                done(null,true)

            },1000)
        }
    },
    {
        type: "list",
        message: "Select team member's role",
        choices: [
            "Engineer",
            "Intern",
            "Manager"
        ],
        name: "role"
    },
    {   type:'input',
        message: "Enter team member's id",
        name: "id",
        validate:function(userId){
            var done = this.async();
            setTimeout(function(){
                if(userId===""){
                    done('You need to provide id:')
                    return;
                }
                done(null,true)

            },1000)
        }
    },
    {
        message: "Enter team member's email address",
        name: "email",
        validate: function (emailInput) {
            return /^.+@.+\..+$/gi.test(emailInput) ? true : false;
          }
    }])
    .then(function({id, role, name, email}) {
        let roleInfo = "";
        if (role === "Engineer") {
            roleInfo = "GitHub username";
        } else if (role === "Intern") {
            roleInfo = "school name";
        } else {
            roleInfo = "office phone number";
        }
        inquirer.prompt([{
            message: `Enter team member's ${roleInfo}`,
            name: "roleInfo"
        },
        {
            type: "list",
            message: "Would you like to add more team members?",
            choices: [
                "yes",
                "no"
            ],
            name: "moreMembers"
        }])
        .then(function({roleInfo, moreMembers}) {
            let newMember;
            if (role === "Engineer") {
                newMember = new Engineer(name, id, email, roleInfo);
            } else if (role === "Intern") {
                newMember = new Intern(name, id, email, roleInfo);
            } else {
                newMember = new Manager(name, id, email, roleInfo);
            }
            employees.push(newMember);
            addHtml(newMember)
            .then(function() {
                if (moreMembers === "yes") {
                    addMember();
                } else {
                    finishHtml();
                }
            });
            
        });
    });
}

// function renderHtml(memberArray) {
//     startHtml();
//     for (const member of memberArray) {
//         addHtml(member);
//     }
//     finishHtml();
// }

function startHtml() {
    const html = fs.readFileSync("./templates/main.html")
    
    fs.writeFile("./output/team.html", html.toString(), function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("start");
}

function addHtml(member) {
    return new Promise(function(resolve, reject) {
        const name = member.getName();
        const role = member.getRole();
        const id = member.getId();
        const email = member.getEmail();
        debugger;
        let data = "";
        if (role === "Engineer") {
            const gitHub = member.getGithub();
            data = `<div class="col-4">
            <div class="card mx-auto mb-3 rounded custom-card" style="width: 18rem">
            <h5 class="card-header bg-primary text-white">${name}<br /><br /><i class="fas fa-mug-hot"></i> Engineer</h5>
            <ul class="list-group list-group-flush m-4">
                <li class="list-group-item">ID: ${id}</li>
                <li class="list-group-item">Email Address: ${email}</li>
                <li class="list-group-item">GitHub: ${gitHub}</li>
            </ul>
            </div>
        </div>`;
        } else if (role === "Intern") {
            const school = member.getSchool();
            data = `<div class="col-4">
            <div class="card mx-auto mb-3 rounded custom-card" style="width: 18rem">
            <h5 class="card-header bg-primary text-white">${name}<br /><br /><i class="fas fa-glasses"></i> Intern</h5>
            <ul class="list-group list-group-flush m-4">
                <li class="list-group-item">ID: ${id}</li>
                <li class="list-group-item">Email Address: ${email}</li>
                <li class="list-group-item">School: ${school}</li>
            </ul>
            </div>
        </div>`;
        } else {
            const officePhone = member.getOfficeNumber();
            data = `<div class="col-4">
            <div class="card mx-auto mb-3 rounded custom-card" style="width: 18rem">
            <h5 class="card-header bg-primary text-white">${name}<br /><br /><i class="fas fa-user-graduate"></i> Manager</h5>
            <ul class="list-group list-group-flush m-4">
                <li class="list-group-item">ID: ${id}</li>
                <li class="list-group-item">Email Address: ${email}</li>
                <li class="list-group-item">Office Phone: ${officePhone}</li>
            </ul>
            </div>
        </div>`
        }
        console.log("adding team member");
        fs.appendFile("./output/team.html", data, function (err) {
            if (err) {
                return reject(err);
            };
            return resolve();
        });
    });
    
            
    
        
    
    
}

function finishHtml() {
    const html = ` </div>
    </div>
    
</body>
</html>`;

    fs.appendFile("./output/team.html", html, function (err) {
        if (err) {
            console.log(err);
        };
    });
    console.log("end");
}

// addMember();
// startHtml();
// addHtml("hi")
// .then(function() {
// finishHtml();
// });
initApp();