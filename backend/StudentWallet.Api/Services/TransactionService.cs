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
}
