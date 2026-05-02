using Microsoft.EntityFrameworkCore;
using StudentWallet.Api.Domain;

namespace StudentWallet.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Student> Students => Set<Student>();
    public DbSet<Wallet> Wallets => Set<Wallet>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Student>(b =>
        {
            b.Property(s => s.StudentNumber).IsRequired().HasMaxLength(32);
            b.HasIndex(s => s.StudentNumber).IsUnique();
            b.Property(s => s.Name).IsRequired().HasMaxLength(100);
            b.Property(s => s.PinHash).IsRequired().HasMaxLength(256);

            b.HasOne(s => s.Wallet)
             .WithOne(w => w.Student)
             .HasForeignKey<Wallet>(w => w.StudentId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Wallet>(b =>
        {
            b.Property(w => w.Balance).HasPrecision(18, 2).HasDefaultValue(0m);
        });

        modelBuilder.Entity<Transaction>(b =>
        {
            b.Property(t => t.Amount).HasPrecision(18, 2);
            b.Property(t => t.BalanceAfter).HasPrecision(18, 2);
            b.Property(t => t.Description).HasMaxLength(256);

            b.HasOne(t => t.Wallet)
             .WithMany(w => w.Transactions)
             .HasForeignKey(t => t.WalletId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(t => new { t.WalletId, t.CreatedAt });
        });
    }
}
