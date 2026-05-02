using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentWallet.Api.Common;
using StudentWallet.Api.Services;

namespace StudentWallet.Api.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly ReportsService _reports;

    public ReportsController(ReportsService reports)
    {
        _reports = reports;
    }

    [HttpGet("daily")]
    public async Task<IActionResult> Daily(
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        CancellationToken ct)
    {
        var studentId = User.GetStudentId();
        var rows = await _reports.GetDailyAsync(studentId, from, to, ct);
        return Ok(rows);
    }

    [HttpGet("totals")]
    public async Task<IActionResult> Totals(CancellationToken ct)
    {
        var studentId = User.GetStudentId();
        var totals = await _reports.GetTotalsAsync(studentId, ct);
        return Ok(totals);
    }
}
