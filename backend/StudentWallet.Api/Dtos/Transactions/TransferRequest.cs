using System.ComponentModel.DataAnnotations;

namespace StudentWallet.Api.Dtos.Transactions;

public class TransferRequest
{
    [Required, StringLength(32)]
    public string ReceiverStudentNumber { get; set; } = null!;

    [Range(1, 10_000_000)]
    public decimal Amount { get; set; }

    [StringLength(256)]
    public string? Description { get; set; }
}
