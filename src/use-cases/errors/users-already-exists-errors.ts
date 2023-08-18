export class UserAlreadyExistsErrors extends Error {
  constructor() {
    super("E-mail already exists");
  }
}
