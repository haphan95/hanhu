import { FriendProvider } from "@/context/friend-context"
import { WeddingPageContent } from "@/components/wedding/wedding-page-content"

export default function WeddingPage() {
  return (
    <FriendProvider initialFriend={null}>
      <WeddingPageContent />
    </FriendProvider>
  )
}
