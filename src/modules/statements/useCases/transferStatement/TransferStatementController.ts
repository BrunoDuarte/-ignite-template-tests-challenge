import { Request, Response } from "express"
import { container } from "tsyringe"
import { TransferStatementUseCase } from "./TransferStatementUseCase"

enum OperationType {
  TRANSFER = 'transfer'
}

class TransferStatementController {

  async execute(request: Request, response: Response): Promise<Response> {
    const { receiver_id } = request.params
    const { id: user_id } = request.user
    const { amount, description } = request.body

    const transferStatementUseCase = container.resolve(TransferStatementUseCase)

    const type = 'transfer' as OperationType

    await transferStatementUseCase.execute({
      user_id,
      receiver_id,
      type,
      amount,
      description
    })
    return response.send()
  }
}

export { TransferStatementController }