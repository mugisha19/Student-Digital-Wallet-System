namespace StudentWallet.Api.Dtos.Wallet;

public record WalletDto(
    int WalletId,
    int StudentId,
    string StudentNumber,
    string Name,
    decimal Balance);
