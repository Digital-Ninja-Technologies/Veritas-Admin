import { getInviteByToken } from "@/lib/data/team";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AcceptInviteForm } from "@/components/team/accept-invite-form";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await getInviteByToken(token);

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <div className="relative h-5 w-8">
              <span className="absolute left-0 top-0 h-5 w-5 rounded-full border-[2.4px] border-foreground" />
              <span className="absolute left-3 top-0 h-5 w-5 rounded-full border-[2.4px] border-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Veritas</span>
          </div>
          <p className="text-sm text-muted-foreground">Customer care invite</p>
        </div>

        {invite ? (
          <AcceptInviteForm token={token} email={invite.email} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Invite not found</CardTitle>
              <CardDescription>
                This invite link is invalid, expired, or has already been used. Ask a super admin to send a new
                one.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
