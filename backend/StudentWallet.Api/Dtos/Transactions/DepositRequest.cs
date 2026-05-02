using System.ComponentModel.DataAnnotations;

namespace StudentWallet.Api.Dtos.Transactions;

public class DepositRequest
{
    [Range(0.01, 1_000_000)]
    public decimal Amount { get; set; }

    [StringLength(256)]
    public string? Description { get; set; }
}
