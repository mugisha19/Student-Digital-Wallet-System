using System.ComponentModel.DataAnnotations;
using StudentWallet.Api.Domain;

namespace StudentWallet.Api.Dtos.Transactions;

public class PaymentRequest
{
    [Range(1, 10_000_000)]
    public decimal Amount { get; set; }

    [Required]
    public ServiceCategory ServiceCategory { get; set; }

    [StringLength(256)]
    public string? Description { get; set; }
}
