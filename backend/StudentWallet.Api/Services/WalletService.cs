using Microsoft.EntityFrameworkCore;
using StudentWallet.Api.Data;
using StudentWallet.Api.Dtos.Wallet;

namespace StudentWallet.Api.Services;

public class WalletService
{
    private readonly AppDbContext _db;

    public WalletService(AppDbContext db)
    {
        _db = db;
    }

    public Task<WalletDto?> GetByStudentIdAsync(int studentId, CancellationToken ct = default) =>
        _db.Wallets
            .AsNoTracking()
            .Where(w => w.StudentId == studentId)
            .Select(w => new WalletDto(
                w.Id,
                w.StudentId,
                w.Student.StudentNumber,
                w.Student.Name,
                w.Balance))
            .FirstOrDefaultAsync(ct);
}
