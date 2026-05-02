using System.Security.Claims;

namespace StudentWallet.Api.Common;

public static class CurrentUser
{
    public static int GetStudentId(this ClaimsPrincipal user)
    {
        var sub = user.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? user.FindFirstValue("sub")
                  ?? throw new UnauthorizedAccessException("Missing sub claim.");
        return int.Parse(sub);
    }
}
