import { injectable } from "tsyringe";

export interface IHelloRepository {
  getMessage(): Promise<string>;
}

@injectable()
export class HelloRepository implements IHelloRepository {
  async getMessage(): Promise<string> {
    return "world";
  }
}
