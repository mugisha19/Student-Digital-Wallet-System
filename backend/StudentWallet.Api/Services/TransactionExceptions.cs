namespace StudentWallet.Api.Services;

public class InsufficientFundsException : Exception
{
    public InsufficientFundsException() : base("Insufficient funds.") { }
}

public class RecipientNotFoundException : Exception
{
    public RecipientNotFoundException(string studentNumber)
        : base($"Receiver '{studentNumber}' not found.") { }
}

public class InvalidTransferException : Exception
{
    public InvalidTransferException(string message) : base(message) { }
}
