using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
}
