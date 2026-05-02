namespace StudentWallet.Api.Dtos.Auth;

public record LoginResponse(string Token, DateTime ExpiresAt, StudentProfileDto Student);
