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

    [HttpPost("pay")]
    public async Task<IActionResult> Pay([FromBody] PaymentRequest req, CancellationToken ct)
    {
        var studentId = User.GetStudentId();
        try
        {
            var txn = await _transactions.PayAsync(studentId, req, ct);
            return Ok(txn);
        }
        catch (InsufficientFundsException)
        {
            return BadRequest(new { message = "Insufficient funds." });
        }
    }

    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer([FromBody] TransferRequest req, CancellationToken ct)
    {
        var studentId = User.GetStudentId();
        try
        {
            var txn = await _transactions.TransferAsync(studentId, req, ct);
            return Ok(txn);
        }
        catch (RecipientNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidTransferException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InsufficientFundsException)
        {
            return BadRequest(new { message = "Insufficient funds." });
        }
    }

    [HttpGet]
    public async Task<IActionResult> History([FromQuery] int skip = 0, [FromQuery] int take = 50, CancellationToken ct = default)
    {
        if (skip < 0) skip = 0;
        if (take <= 0 || take > 200) take = 50;
        var studentId = User.GetStudentId();
        var rows = await _transactions.GetHistoryAsync(studentId, skip, take, ct);
        return Ok(rows);
    }
}
