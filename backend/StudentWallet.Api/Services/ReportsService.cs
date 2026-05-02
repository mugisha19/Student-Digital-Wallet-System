using Microsoft.EntityFrameworkCore;
using StudentWallet.Api.Data;
using StudentWallet.Api.Domain;
using StudentWallet.Api.Dtos.Reports;

namespace StudentWallet.Api.Services;

public class ReportsService
{
    private readonly AppDbContext _db;

    public ReportsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<DailySummaryDto>> GetDailyAsync(
        int studentId, DateOnly? from, DateOnly? to, CancellationToken ct = default)
    {
        var query = _db.Transactions
            .AsNoTracking()
            .Where(t => t.Wallet.StudentId == studentId);

        if (from.HasValue)
        {
            var fromDt = from.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
            query = query.Where(t => t.CreatedAt >= fromDt);
        }
        if (to.HasValue)
        {
            var toDt = to.Value.AddDays(1).ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
            query = query.Where(t => t.CreatedAt < toDt);
        }

        var rows = await query
            .GroupBy(t => DateOnly.FromDateTime(t.CreatedAt))
            .OrderByDescending(g => g.Key)
            .Select(g => new DailySummaryDto(
                g.Key,
                g.Where(x => x.Type == TransactionType.Deposit).Sum(x => (decimal?)x.Amount) ?? 0m,
                g.Where(x => x.Type == TransactionType.Payment).Sum(x => (decimal?)x.Amount) ?? 0m,
                g.Where(x => x.Type == TransactionType.TransferIn).Sum(x => (decimal?)x.Amount) ?? 0m,
                g.Where(x => x.Type == TransactionType.TransferOut).Sum(x => (decimal?)x.Amount) ?? 0m))
            .ToListAsync(ct);

        return rows;
    }

    public async Task<TotalsDto> GetTotalsAsync(int studentId, CancellationToken ct = default)
    {
        var groups = await _db.Transactions
            .AsNoTracking()
            .Where(t => t.Wallet.StudentId == studentId)
            .GroupBy(t => t.Type)
            .Select(g => new { Type = g.Key, Total = g.Sum(x => x.Amount) })
            .ToListAsync(ct);

        decimal Get(TransactionType t) => groups.FirstOrDefault(g => g.Type == t)?.Total ?? 0m;

        return new TotalsDto(
            Get(TransactionType.Deposit),
            Get(TransactionType.Payment),
            Get(TransactionType.TransferIn),
            Get(TransactionType.TransferOut));
    }
}
