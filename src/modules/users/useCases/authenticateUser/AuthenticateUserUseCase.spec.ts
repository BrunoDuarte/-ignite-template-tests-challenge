import "reflect-metadata"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to authenticate the user", async () => {

    const user: ICreateUserDTO = {
      name: "bduarte",
      email: "fbruno.c.duarte@gmail.com",
      password: "12345"
    }

    await createUserUseCase.execute(user)

    
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })
    
    expect(result).toHaveProperty("token")
  })
})