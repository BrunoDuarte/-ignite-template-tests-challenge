import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

describe("Create deposit", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)

    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  it("should be able to create a deposit", async () => {
    const user: ICreateUserDTO = {
      name: "bduarte",
      email: "fbruno.c.duarte@gmail.com",
      password: "12345"
    }

    await createUserUseCase.execute(user)

    
    const authUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    const user_id = authUser.user.id as string
    const type = 'deposit' as OperationType
    const amount = 1.200
    const description = "primeiro boleto"

    const deposit = await createStatementUseCase.execute({
      user_id,
      type,
      amount, 
      description
    })

    expect(deposit).toHaveProperty('id')
  })

  it("should be able to withdraw", async () => {
    const user: ICreateUserDTO = {
      name: "bduarte",
      email: "fbruno.c.duarte@gmail.com",
      password: "12345"
    }

    await createUserUseCase.execute(user)

    
    const authUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    let user_id = authUser.user.id as string
    let type = 'deposit' as OperationType
    let amount = 1.200
    let description = "primeiro boleto"

    await createStatementUseCase.execute({
      user_id,
      type,
      amount, 
      description
    })

    type = 'withdraw' as OperationType
    amount = 0.200
    description = "primeiro saque"

    const deposit = await createStatementUseCase.execute({
      user_id,
      type,
      amount, 
      description
    })

    expect(deposit.amount).toEqual(amount)

    // console.log(deposit)
  })
})