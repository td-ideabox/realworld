import { inject, injectable } from "tsyringe";
import type { IHelloRepository } from "../repositories/hello.repository.js";

export interface IHelloService {
  getHelloMessage(): Promise<string>;
}

@injectable()
export class HelloService implements IHelloService {
  constructor(
    @inject("IHelloRepository") private helloRepository: IHelloRepository,
  ) {}

  async getHelloMessage(): Promise<string> {
    return await this.helloRepository.getMessage();
  }
}
