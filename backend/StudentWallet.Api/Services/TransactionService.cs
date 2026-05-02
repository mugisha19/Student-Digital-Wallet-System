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

    public async Task<TransactionDto> PayAsync(int studentId, PaymentRequest req, CancellationToken ct = default)
    {
        var wallet = await _db.Wallets.FirstAsync(w => w.StudentId == studentId, ct);

        if (wallet.Balance < req.Amount)
            throw new InsufficientFundsException();

        wallet.Balance -= req.Amount;

        var txn = new Transaction
        {
            WalletId = wallet.Id,
            Type = TransactionType.Payment,
            Amount = req.Amount,
            BalanceAfter = wallet.Balance,
            ServiceCategory = req.ServiceCategory,
            Description = req.Description
        };
        _db.Transactions.Add(txn);

        await _db.SaveChangesAsync(ct);
        return Map(txn);
    }

    public async Task<TransactionDto> TransferAsync(int senderStudentId, TransferRequest req, CancellationToken ct = default)
    {
        var sender = await _db.Wallets
            .Include(w => w.Student)
            .FirstAsync(w => w.StudentId == senderStudentId, ct);

        var receiver = await _db.Wallets
            .Include(w => w.Student)
            .FirstOrDefaultAsync(w => w.Student.StudentNumber == req.ReceiverStudentNumber, ct);

        if (receiver is null)
            throw new RecipientNotFoundException(req.ReceiverStudentNumber);

        if (receiver.StudentId == senderStudentId)
            throw new InvalidTransferException("Cannot transfer to your own account.");

        if (sender.Balance < req.Amount)
            throw new InsufficientFundsException();

        await using var dbTxn = await _db.Database.BeginTransactionAsync(ct);

        sender.Balance -= req.Amount;
        var outRow = new Transaction
        {
            WalletId = sender.Id,
            Type = TransactionType.TransferOut,
            Amount = req.Amount,
            BalanceAfter = sender.Balance,
            CounterpartyWalletId = receiver.Id,
            Description = req.Description
        };
        _db.Transactions.Add(outRow);

        receiver.Balance += req.Amount;
        var inRow = new Transaction
        {
            WalletId = receiver.Id,
            Type = TransactionType.TransferIn,
            Amount = req.Amount,
            BalanceAfter = receiver.Balance,
            CounterpartyWalletId = sender.Id,
            Description = req.Description
        };
        _db.Transactions.Add(inRow);

        await _db.SaveChangesAsync(ct);
        await dbTxn.CommitAsync(ct);

        return Map(outRow, receiver.Student.StudentNumber);
    }

    public async Task<IReadOnlyList<TransactionDto>> GetHistoryAsync(int studentId, int skip, int take, CancellationToken ct = default)
    {
        return await _db.Transactions
            .AsNoTracking()
            .Where(t => t.Wallet.StudentId == studentId)
            .OrderByDescending(t => t.CreatedAt)
            .Skip(skip)
            .Take(take)
            .Select(t => new TransactionDto(
                t.Id,
                t.Type,
                t.Amount,
                t.BalanceAfter,
                t.ServiceCategory,
                _db.Wallets
                    .Where(w => w.Id == t.CounterpartyWalletId)
                    .Select(w => w.Student.StudentNumber)
                    .FirstOrDefault(),
                t.Description,
                t.CreatedAt))
            .ToListAsync(ct);
    }
}
