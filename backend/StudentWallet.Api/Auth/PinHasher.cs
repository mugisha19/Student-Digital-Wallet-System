using Microsoft.AspNetCore.Identity;
using StudentWallet.Api.Domain;

namespace StudentWallet.Api.Auth;

public class PinHasher
{
    private readonly PasswordHasher<Student> _inner = new();

    public string Hash(Student student, string pin) => _inner.HashPassword(student, pin);

    public bool Verify(Student student, string pin) =>
        _inner.VerifyHashedPassword(student, student.PinHash, pin) != PasswordVerificationResult.Failed;
}
