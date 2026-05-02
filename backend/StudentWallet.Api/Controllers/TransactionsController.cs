using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentWallet.Api.Common;
using StudentWallet.Api.Dtos.Transactions;
using StudentWallet.Api.Services;

namespace StudentWallet.Api.Controllers;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly TransactionService _transactions;

    public TransactionsController(TransactionService transactions)
    {
        _transactions = transactions;
    }

    [HttpPost("deposit")]
    public async Task<IActionResult> Deposit([FromBody] DepositRequest req, CancellationToken ct)
    {
        var studentId = User.GetStudentId();
        var txn = await _transactions.DepositAsync(studentId, req, ct);
        return Ok(txn);
    }
}
