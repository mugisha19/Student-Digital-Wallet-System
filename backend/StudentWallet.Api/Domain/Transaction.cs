namespace StudentWallet.Api.Domain;

public class Transaction
{
    public long Id { get; set; }

    public int WalletId { get; set; }

    public Wallet Wallet { get; set; } = null!;

    public TransactionType Type { get; set; }

    public decimal Amount { get; set; }

    public decimal BalanceAfter { get; set; }

    public ServiceCategory? ServiceCategory { get; set; }

    public int? CounterpartyWalletId { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
