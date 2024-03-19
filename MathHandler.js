const fs = require('fs');
//const BaseHandler = require('./baseHandler.js');

const BaseHandler=require(`./baseHandler.js`)

class MathHandler extends BaseHandler {
    constructor() {
        super();
        this.help = {
            'add' : 'add : add command is used to perform addition between two or more numbers',
            'subtract' : 'subtract : subtract command is used to perform subtraction between the given numbers',
            'multiply' : 'multiply : multiply command is used to multiply the given  numbers',
            'divide' : 'divide : divide command is used to divide the two given numbers',
        };
    }
    handleInput(input) {
        
            let list = input.slice(2);
            const test={
                "--add":this.add(list),
                "-a":this.add(list),
                "subtract" : this.subtract(list),
                '-s' : this.subtract(list),
                "--multiply" : this.multiply(list),
                "-m" : this.multiply(list),
                "--divide" : this.divide(list),
                "-d" : this.divide(list)
            };
            if (input[1] in test) {
                console.log(test[input[1]]);
            }
            else if (input[1] == '--help' || input[2] == '--help') {
                this.help(input);
            }

            else {
                console.log("Invalid Command.");
            }
        
    }

    add(numbers) {
        let result = 0;
        for (let i of numbers) {
            if (typeof(Number(i)) === 'number'){
                result += Number(i);
            }
            else {
                console.log('Error: Enter a number');
            }
            
        }
        return result;
    }

    subtract(numbers) {
        let result = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
            if (typeof(Number(i)) === 'number'){
                result -= numbers[Number(i)];
            }
            else {
                console.log('Error: Enter a number');
            }
            
        }
        return result;
    }

    multiply(numbers) {
        let result = 1;
        for (let i of numbers) {
            if (typeof(Number(i)) === 'number'){
                result *= Number(i);
            }
            else {
                console.log('Error: Enter a number');
            }
        }
        return result;
    }

    divide(numbers) {
        let result = numbers[0];
        
        for (let i=1;i<numbers.length;i++) {
          let b = numbers[i]+1;
          if (b === 0) {
            throw new Error('Cannot divide by zero');
        }
        if (typeof(Number(i)) === 'number'){
            result/=numbers[i]
        }
        else {
            console.log('Error: Enter a number');
        }
            
        }
        return result;
      }

    help(input) {
        let helpObj = {
            'add' : 'add : add command is used to perform addition between two or more numbers',
            'subtract' : 'subtract : subtract command is used to perform subtraction between the given numbers',
            'multiply' : 'multiply : multiply command is used to multiply the given  numbers',
            'divide' : 'divide : divide command is used to divide the two given numbers',
            'a' : 'add command is used to perform addition between two or more numbers',
            's' : 'subtract command is used to perform subtraction between the given numbers',
            'm' : 'multiply command is used to multiply the given  numbers',
            'd' : 'divide command is used to divide the two given numbers',
            
            
            };



        let slicedInput;
        if (input[1] == '--help') {
            slicedInput = input[0];
            //let mathObj = [];
            let maxLen = 4;
            let printedCount = 0;
            for (const key in helpObj) {
                if (helpObj.hasOwnProperty(key)) {
                    this.mathObj.push(`${helpObj[key]}`);
                    printedCount++;
                    if (printedCount>=maxLen) {
                        break;
                    }
                }
            }
            console.log(this.mathObj)
        }
        else if (input[2] == '--help') {
            slicedInput = input[1];
            console.log(helpObj[slicedInput]);
        }
    
        else {
            console.log("Entered invalid Command.")
        }
            
    }

    seekHelp() {
        console.log(this.mathObj);
    }
}



module.exports = MathHandler;