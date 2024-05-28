import fs from "fs";
import path from "path";
import { Employee } from "./Employee";

export class BirthdayService {
  constructor() {}

  sendGreetings(ourDate, fileName, smtpUrl, smtpPort, transport) {
    const employeeDataFile = fs.readFileSync(
      path.resolve(__dirname, `${fileName}`),
      "UTF-8"
    );

    const employeeRecords = employeeDataFile.split(/\r?\n/);
    employeeRecords.shift();
    const employees = employeeRecords
      .map((record) => this.createEmployeeFromLine(record))
      .filter((employee) => employee.isBirthday(ourDate));

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
    const employee = new Employee(
      employeeData[1],
      employeeData[0],
      employeeData[2],
      employeeData[3]
    );
    return employee;
  }
}