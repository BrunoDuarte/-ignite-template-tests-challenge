import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementError } from "../createStatement/CreateStatementError"
import { ICreateTransferDTO } from "./ICreateTransferDTO"
import { OperationType } from "../../entities/Statement"

@injectable()
class TransferStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({user_id, destination_id, amount, description}: ICreateTransferDTO) {
    const user = await this.usersRepository.findById(destination_id)

    if(!user) throw new CreateStatementError.UserNotFound()

    const { balance } = await this.statementsRepository.getUserBalance({ user_id })

    if (balance < amount) throw new CreateStatementError.InsufficientFunds()

    console.log(`destination_id: ${destination_id}`)

    const transferOperation = await this.statementsRepository.create({
      user_id,
      destination_id,
      type: OperationType.TRANSFER,
      amount,
      description
    })

    return transferOperation
  }
}

export { TransferStatementUseCase }