using StudentWallet.Api.Domain;

namespace StudentWallet.Api.Dtos.Transactions;

public record TransactionDto(
    long Id,
    TransactionType Type,
    decimal Amount,
    decimal BalanceAfter,
    ServiceCategory? ServiceCategory,
    string? CounterpartyStudentNumber,
    string? Description,
    DateTime CreatedAt);
