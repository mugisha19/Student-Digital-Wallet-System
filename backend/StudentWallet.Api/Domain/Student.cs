namespace StudentWallet.Api.Domain;

public class Student
{
    public int Id { get; set; }

    public string StudentId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string PinHash { get; set; } = null!;

    public int FailedAttempts { get; set; }

    public bool IsLocked { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Wallet Wallet { get; set; } = null!;
}
