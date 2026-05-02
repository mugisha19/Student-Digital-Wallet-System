namespace StudentWallet.Api.Dtos.Reports;

public record TotalsDto(
    decimal TotalDeposits,
    decimal TotalPayments,
    decimal TotalTransfersIn,
    decimal TotalTransfersOut);
