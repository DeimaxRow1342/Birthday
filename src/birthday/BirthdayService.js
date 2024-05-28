import fs from "fs";
import path from "path";
import { Employee } from "./Employee";

export class BirthdayService {
  constructor() {}

  sendGreetings(ourDate, fileName, smtpUrl, smtpPort, transport) {
    const employees = this.loadEmployeesFromFile(fileName)
      .filter((employee) => employee.isBirthday(ourDate));

    this.sendBirthdayGreetings(employees, smtpUrl, smtpPort, transport);
  }

  loadEmployeesFromFile(fileName) {
    const employeeDataFile = fs.readFileSync(
      path.resolve(__dirname, `${fileName}`),
      "UTF-8"
    );

    const employeeRecords = employeeDataFile.split(/\r?\n/);
    employeeRecords.shift();
    return employeeRecords.map((record) => this.createEmployeeFromLine(record));
  }

  sendBirthdayGreetings(employees, smtpUrl, smtpPort, transport) {
    employees.forEach((employee) => {
      const message = {
        host: smtpUrl,
        port: smtpPort,
        from: "sender@here.com",
        to: [employee.getEmail()],
        subject: "Happy Birthday!",
        text: `Happy Birthday, dear ${employee.getFirstName()}!`,
      };
      transport.sendMail(message);
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