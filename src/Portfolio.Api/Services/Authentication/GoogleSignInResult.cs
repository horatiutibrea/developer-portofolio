using Portfolio.Api.Models.Identity;

namespace Portfolio.Api.Services.Authentication;

public sealed record GoogleSignInResult(
    User User,
    IReadOnlyList<Role> ActiveRoles,
    bool IsNewUser,
    bool SubjectLinked);

public enum GoogleSignInFailure
{
    EmailNotVerified,
    IdentityConflict,
    UserLocked,
    NoActiveRole
}

public sealed class GoogleSignInException(GoogleSignInFailure failure) : Exception(failure.ToString())
{
    public GoogleSignInFailure Failure { get; } = failure;
}
