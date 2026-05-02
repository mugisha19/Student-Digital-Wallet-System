using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentWallet.Api.Auth;
using StudentWallet.Api.Data;
using StudentWallet.Api.Dtos.Auth;

namespace StudentWallet.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;
    private readonly JwtTokenService _tokens;
    private readonly AppDbContext _db;

    public AuthController(AuthService auth, JwtTokenService tokens, AppDbContext db)
    {
        _auth = auth;
        _tokens = tokens;
        _db = db;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req, CancellationToken ct)
    {
        var outcome = await _auth.AuthenticateAsync(req.StudentNumber, req.Pin, ct);

        switch (outcome.Status)
        {
            case AuthStatus.NotFound:
                return NotFound(new { message = "Student not found." });

            case AuthStatus.Locked:
                return StatusCode(StatusCodes.Status423Locked, new
                {
                    message = "Account locked due to too many failed attempts. Contact an administrator."
                });

            case AuthStatus.InvalidPin:
                return Unauthorized(new
                {
                    message = "Invalid PIN.",
                    attemptsRemaining = outcome.AttemptsRemaining
                });

            case AuthStatus.Success:
                var student = outcome.Student!;
                var wallet = await _db.Wallets.AsNoTracking().FirstAsync(w => w.StudentId == student.Id, ct);
                var (token, expiresAt) = _tokens.Issue(student);
                return Ok(new LoginResponse(
                    token,
                    expiresAt,
                    new StudentProfileDto(student.Id, student.StudentNumber, student.Name, wallet.Id)));

            default:
                return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req, CancellationToken ct)
    {
        try
        {
            var student = await _auth.RegisterAsync(req.StudentNumber, req.Name, req.Pin, ct);
            var wallet = await _db.Wallets.AsNoTracking().FirstAsync(w => w.StudentId == student.Id, ct);
            var profile = new StudentProfileDto(student.Id, student.StudentNumber, student.Name, wallet.Id);
            return CreatedAtAction(nameof(Login), profile);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}
