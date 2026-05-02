namespace StudentWallet.Api.Dtos.Reports;

public record DailySummaryDto(
    DateOnly Date,
    decimal Deposits,
    decimal Payments,
    decimal TransfersIn,
    decimal TransfersOut);
