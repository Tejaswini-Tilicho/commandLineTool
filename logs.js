const fs = require('fs');

class Logger {
  constructor() {
    this.logFilePath;
    this.loggingEnabled = false;
    this.bool = true;
    this.logCommands = [];
    this.serial = 1;
  }

  startLogging(filePath) {
    try {
      this.logFilePath = filePath;
      console.log(this.logFilePath)

      if (!this.loggingEnabled && this.logFilePath && this.bool) {
        fs.writeFileSync(filePath, 'S.No      Time Stamp      Command\n', 'utf-8');
        this.loggingEnabled = true;
        this.bool = false;
        console.log(`Logging started. Log file: ${this.logFilePath}`);
      }

    }
    catch {
      console.log('Enter the path')
    }


  }

  logCommand(command) {
    if (this.loggingEnabled) {
      command = command.join(" ");
      const timestamp = new Date().toLocaleString();
      const logEntry = `${this.serial} ${timestamp}: ${command}\n`;
      this.serial++;
      fs.appendFileSync(this.logFilePath, logEntry);
    } else {
      console.log('Logging is not enabled. Use "log --start <path>" to start logging.');
    }
  }

  printAllLogs() {
    const logs = fs.readFileSync(this.logFilePath, 'utf8');
    console.log('All logs:');
    console.log(logs);
  }

  printTailLogs(count) {
    const logs = fs.readFileSync(this.logFilePath, 'utf8');
    const lines = logs.split('\n').slice(-count - 1);
    console.log(`Last ${count} logs:`);
    console.log(lines.join('\n'));
  }

  printHeadLogs(count) {
    const logs = fs.readFileSync(this.logFilePath, 'utf8');
    const lines = logs.split('\n').slice(0, count);
    console.log(`First ${count} logs:`);
    console.log(lines.join('\n'));
  }

  clearLogs() {
    fs.writeFileSync(this.logFilePath, '', 'utf8');
    console.log('Logs cleared.');
  }

  stopLogging() {
    this.loggingEnabled = false;
    console.log('Logging stopped. Log file: ', this.logFilePath);
  }

  executeLogs(input) {

    switch (input[1]) {
      case '--start':
        this.startLogging(input[2]);
        break;
      case '--stop':
        return this.stopLogging();
      case '--clear':
        return this.clearLogs();
      case '--all':
        return this.printAllLogs();
      case '--tail':
        return this.printTailLogs(input[2]);
      case '--head':
        return this.printHeadLogs(input[2]);
      default:
        console.log("Not a log command");
    }

  }
}



module.exports = { Logger };