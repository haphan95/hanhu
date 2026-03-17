import { redirect } from "next/navigation";
import { FriendProvider } from "@/context/friend-context";
import { WeddingPageContent } from "@/components/wedding/wedding-page-content";
import { getFriendBySlug } from "@/lib/friends";

export default async function ThiepMoiInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const friend = await getFriendBySlug(slug);
  if (!friend) redirect("/");

  return (
    <FriendProvider initialFriend={friend}>
      <WeddingPageContent />
    </FriendProvider>
  );
}
