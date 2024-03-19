
class CommandRegistry {
    constructor() {
        this.registry = {};
        this.object;
        this.helpObject = {
            'register': 'Used to register a command and actions assigned to the command `register <command_name>`',
            'unregister': 'Used to unregister a command and actions assigned to the command `unregister <command_name>`',
            'activate': 'Used to activate the given command if registered',
            'deactivate': 'Used to deactivate the given command but still present registered',
            'history': 'Used to give the history of all commands',
            'log': 'Used to log all the commands'
        };
    }

    register(input) {

        try {
            let executor = input[2];

            let res = require(`./${executor}.js`)

            const baseClass = require(`./baseHandler.js`);

            this.object = new res();

            let command = input[1];
            if (this.registry[command]?.isActive) {
                console.log(`Command ${command} already registered`);
            } // isActive should be from registry obj

            else if (this.object instanceof baseClass) {

                this.registry[command] = { "object": this.object };

                this.activate(input);
                console.log(`Command ${command} is registered`);
            }

            else {
                console.log(`Command is invalid`);
            }
        }
        catch (error) {

            console.log(error?.message, "Command is not registered") // write a meaningful error message
        }
    }

    unregister(input) {
        try {
            let command = input[1];
            if (this.registry[command]) {

                delete this.registry[command];
                console.log(`Command ${command} got unregistered`)
            }

            else {
                console.log(`Command ${command} is not found.`);
            }
        }
        catch (error) {
            console.log(error?.message, "Command is not unregistered")
        }
    }

    activate(input) {
        try {
            let temp = input[1];

            if (this.registry[temp]?.isActive && this.registry[temp]) {
                console.log(`Command ${temp} is already activated`);
            }
            else if (!this.registry[temp]?.isActive && this.registry[temp]) {
                this.registry[temp].isActive = true;
                console.log(`Command ${temp} is activated`);
            }

            else {
                console.log(`Command ${temp} is not registered`);
            }
        }
        catch (error) {
            console.log(error?.message, "Command is not activated")
        }

    }

    deactivate(input) {
        try {
            let command = input[1];
            if (!this.registry[input[1]]?.isActive && this.registry[command]) { // add other check to check it is registered or not
                console.log(`Command ${command} is already deactivated`);
            }

            else if (this.registry[input[1]]?.isActive) {
                this.registry[input[1]].isActive = false;
                console.log(`Command ${command} got deactivated`);
            }

            else {
                console.log(`Command ${command} is not found.`);
            }
        }
        catch (error) {
            console.log(error?.message, "Command is not deactivated")
        }

    }

    helpInRegistry(input) {

        let slicedInput = input[0];

        if (input[1] == '--help' && slicedInput in helpObject) {
            console.log(this.helpObject[slicedInput]);
        }
        else if (input[0] === '--help' && input.length === 1) {
            console.log(this.helpObject);
        }
        else {
            console.log("Entered invalid command");
        }
    }




}

let commandRegistry = new CommandRegistry();
const { Logger } = require('./logs.js');
class CMD {
    constructor() {
        this.commands = [];
        this.logBool = {};
        this.logger = new Logger();
        this.mainObject = {};
    }
    executeCommand(input) {
        let commands = ['register', 'unregister', 'activate', 'deactivate', 'history', 'exit'];
        this.commands.push(input.join(" "));

        if (this.logger.loggingEnabled) {
            this.logger.logCommands.push(input);
            this.logger.logCommand(input)
        }


        if ((input[1] == '--help' && commands.includes(input[0]))) {
            commandRegistry.helpInRegistry(input);
        }

        else if (commands.includes(input[0])) {
            if (commands.includes(input[0]) && commands.includes(input[1])) {
                return console.log(`${input[0]} cannot access default commands`)
            }
            switch (input[0]) {

                case 'register':
                    if (input.length === 3) {
                        return commandRegistry.register(input);
                    }
                    else {
                        console.log('Invalid length of input')
                        break;
                    }

                case 'unregister':
                    if (input.length === 2) {
                        return commandRegistry.unregister(input);
                    }
                    else {
                        console.log('Invalid length of input')
                        break;
                    }
                case 'activate':
                    if (input.length == 2) {
                        return commandRegistry.activate(input);
                    }
                    else {
                        console.log('Invalid length of input')
                        break;
                    }

                case 'deactivate':
                    if (input.length == 2) {
                        return commandRegistry.deactivate(input);
                    }
                    else {
                        console.log('Invalid length of input')
                        break;
                    }

                case 'history':
                    if (input[0] == 'history' && typeof (input[1]) == 'number' && input.length === 2) {
                        this.historyCommands(input[1]);
                        break;
                    }
                    else if (input[0] == 'history' && input.length === 1) {
                        this.historyCommands(5);
                        break;
                    }
                    else {
                        console.log('Invalid history command')
                        process.exit();
                    }
                case 'exit':
                    break;
                default:
                    console.log('Entered invalid command');
            }
        }

        else if (input[0] === 'log') {
            this.logger.executeLogs(input);


        }
        else if (input[0] === '--help' && input.length === 1) {
            let reg = commandRegistry.registry;
            this.mainObject = { ...commandRegistry.helpObject }
            Object.keys(reg)?.forEach((item) => {
                this.mainObject = { ...this.mainObject, [item]: reg[item]?.object?.help }

            })

            console.log(this.mainObject);
        }
        else {
            let reg = commandRegistry.registry;
            let object = reg[input[0]]?.object;
            let state = reg[input[0]]?.isActive;



            if (reg.hasOwnProperty(input[0]) && state) { //use reg directly
                object.handleInput(input);
            }
            else if (object) {
                console.log("Please activate this command");
            }
            else {
                console.log('Invalid command')
            }
        }


    }
    historyCommands(count) {
        let commandHistory = [...this.commands];
        console.log(commandHistory.slice(-Number(count)))
    }
}

const prompt = require('prompt-sync')();
const cmd = new CMD();
while (true) {
    let commandLine = prompt("Enter Command:");
    let input = commandLine.split(" ");
    if (input == 'exit') {
        break;
    }
    cmd.executeCommand(input);
}

