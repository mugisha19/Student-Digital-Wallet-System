using System.ComponentModel.DataAnnotations;

namespace StudentWallet.Api.Dtos.Auth;

public class LoginRequest
{
    [Required, StringLength(32)]
    public string StudentNumber { get; set; } = null!;

    [Required, StringLength(8, MinimumLength = 4)]
    public string Pin { get; set; } = null!;
}
