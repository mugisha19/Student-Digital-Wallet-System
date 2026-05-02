using Microsoft.EntityFrameworkCore;
using StudentWallet.Api.Data;
using StudentWallet.Api.Domain;

namespace StudentWallet.Api.Auth;

public class AuthService
{
    public const int MaxFailedAttempts = 3;

    private readonly AppDbContext _db;
    private readonly PinHasher _hasher;

    public AuthService(AppDbContext db, PinHasher hasher)
    {
        _db = db;
        _hasher = hasher;
    }

    public async Task<AuthOutcome> AuthenticateAsync(string studentNumber, string pin, CancellationToken ct = default)
    {
        var student = await _db.Students.FirstOrDefaultAsync(s => s.StudentNumber == studentNumber, ct);
        if (student is null)
            return new AuthOutcome(AuthStatus.NotFound, null, 0);

        if (student.IsLocked)
            return new AuthOutcome(AuthStatus.Locked, student, 0);

        if (_hasher.Verify(student, pin))
        {
            if (student.FailedAttempts != 0)
            {
                student.FailedAttempts = 0;
                await _db.SaveChangesAsync(ct);
            }
            return new AuthOutcome(AuthStatus.Success, student, MaxFailedAttempts);
        }

        student.FailedAttempts++;
        if (student.FailedAttempts >= MaxFailedAttempts)
            student.IsLocked = true;

        await _db.SaveChangesAsync(ct);

        return student.IsLocked
            ? new AuthOutcome(AuthStatus.Locked, student, 0)
            : new AuthOutcome(AuthStatus.InvalidPin, student, MaxFailedAttempts - student.FailedAttempts);
    }

    public async Task<Student> RegisterAsync(string studentNumber, string name, string pin, CancellationToken ct = default)
    {
        var exists = await _db.Students.AnyAsync(s => s.StudentNumber == studentNumber, ct);
        if (exists)
            throw new InvalidOperationException($"Student '{studentNumber}' already exists.");

        var student = new Student
        {
            StudentNumber = studentNumber,
            Name = name,
            Wallet = new Wallet()
        };
        student.PinHash = _hasher.Hash(student, pin);

        _db.Students.Add(student);
        await _db.SaveChangesAsync(ct);

        return student;
    }
}
