import { OurDate } from "./OurDate";
import { InMemoryTransport } from "./InMemoryTransport";
import { BirthdayService } from "./BirthdayService";

describe("Acceptance", () => {
  const SMTP_PORT = 25;
  const SMTP_URL = "localhost";
  const FILENAME = "employee_data.txt";
  let birthdayService;
  let transport;

  beforeEach(() => {
    transport = new InMemoryTransport();
    birthdayService = new BirthdayService(FILENAME, SMTP_URL, SMTP_PORT, transport);
  });

  it("sends greetings on employees' birthday", () => {
    birthdayService.sendGreetings(new OurDate("2008/10/08"));

    expect(transport.messagesSent.length).toEqual(1);
    const message = transport.messagesSent[0];
    expect(message.text).toEqual("Happy Birthday, dear John!");
    expect(message.subject).toEqual("Happy Birthday!");
    const tos = message.to;
    expect(tos.length).toEqual(1);
    expect(tos[0]).toEqual("john.doe@foobar.com");
  });

  it("does not send emails when it's not anybody's birthday", () => {
    birthdayService.sendGreetings(new OurDate("2008/01/01"));

    expect(transport.messagesSent.length).toEqual(0);
  });

  it("uses correct transport settings", () => {
    birthdayService.sendGreetings(new OurDate("2008/10/08"));

    const message = transport.messagesSent[0];
    expect(message.host).toEqual(SMTP_URL);
    expect(message.port).toEqual(SMTP_PORT);
  });
});