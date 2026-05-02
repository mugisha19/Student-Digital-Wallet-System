using Microsoft.EntityFrameworkCore;
using StudentWallet.Api.Data;
using StudentWallet.Api.Domain;
using StudentWallet.Api.Dtos.Transactions;

namespace StudentWallet.Api.Services;

public class TransactionService
{
    private readonly AppDbContext _db;

    public TransactionService(AppDbContext db)
    {
        _db = db;
    }

    private static TransactionDto Map(Transaction t, string? counterpartyStudentNumber = null) =>
        new(t.Id, t.Type, t.Amount, t.BalanceAfter, t.ServiceCategory,
            counterpartyStudentNumber, t.Description, t.CreatedAt);

    public async Task<TransactionDto> DepositAsync(int studentId, DepositRequest req, CancellationToken ct = default)
    {
        var wallet = await _db.Wallets.FirstAsync(w => w.StudentId == studentId, ct);

        wallet.Balance += req.Amount;

        var txn = new Transaction
        {
            WalletId = wallet.Id,
            Type = TransactionType.Deposit,
            Amount = req.Amount,
            BalanceAfter = wallet.Balance,
            Description = req.Description
        };
        _db.Transactions.Add(txn);

        await _db.SaveChangesAsync(ct);
        return Map(txn);
    }
}
