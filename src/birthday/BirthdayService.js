import fs from "fs";
import path from "path";
import { Employee } from "./Employee";

export class BirthdayService {
  constructor(fileName, smtpUrl, smtpPort, transport) {
    this.fileName = fileName;
    this.smtpUrl = smtpUrl;
    this.smtpPort = smtpPort;
    this.transport = transport;
  }

  sendGreetings(ourDate) {
    const employees = this.loadEmployeesFromFile()
      .filter((employee) => employee.isBirthday(ourDate));

    this.sendBirthdayGreetings(employees);
  }

  loadEmployeesFromFile() {
    const employeeDataFile = fs.readFileSync(
      path.resolve(__dirname, `${this.fileName}`),
      "UTF-8"
    );

    const employeeRecords = employeeDataFile.split(/\r?\n/);
    employeeRecords.shift();
    return employeeRecords.map((record) => this.createEmployeeFromLine(record));
  }

  sendBirthdayGreetings(employees) {
    employees.forEach((employee) => {
      const message = {
        host: this.smtpUrl,
        port: this.smtpPort,
        from: "sender@here.com",
        to: [employee.getEmail()],
        subject: "Happy Birthday!",
        text: `Happy Birthday, dear ${employee.getFirstName()}!`,
      };
      this.transport.sendMail(message);
    });
  }

  createEmployeeFromLine(line) {
    const employeeData = line.split(", ");
    return new Employee(
      employeeData[1],
      employeeData[0],
      employeeData[2],
      employeeData[3]
    );
  }
}