import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../../../statements/useCases/createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase: GetBalanceUseCase

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)

    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
  }

  it("should be able to get the balance", async () => {
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

    await createStatementUseCase.execute({
      user_id,
      type,
      amount, 
      description
    })

    const result = await getBalanceUseCase.execute({ 
      user_id
    })

    expect(result.balance).toEqual(amount)

  })
})