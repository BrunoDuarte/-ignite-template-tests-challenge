enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

interface ICreateTransferDTO {
  user_id: string
  destination_id: string
  type: OperationType
  amount: number
  description: string
}

export { ICreateTransferDTO }