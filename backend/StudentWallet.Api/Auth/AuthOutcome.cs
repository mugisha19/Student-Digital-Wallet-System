using StudentWallet.Api.Domain;

namespace StudentWallet.Api.Auth;

public enum AuthStatus
{
    Success,
    NotFound,
    Locked,
    InvalidPin
}

public record AuthOutcome(AuthStatus Status, Student? Student, int AttemptsRemaining);
