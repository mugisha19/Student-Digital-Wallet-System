using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentWallet.Api.Common;
using StudentWallet.Api.Services;

namespace StudentWallet.Api.Controllers;

[ApiController]
[Route("api/wallet")]
[Authorize]
public class WalletController : ControllerBase
{
    private readonly WalletService _wallets;

    public WalletController(WalletService wallets)
    {
        _wallets = wallets;
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var studentId = User.GetStudentId();
        var wallet = await _wallets.GetByStudentIdAsync(studentId, ct);
        return wallet is null ? NotFound() : Ok(wallet);
    }
}
