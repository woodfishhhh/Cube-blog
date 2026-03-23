import { getAuthorInfo, getFriendLinks, getPosts } from "@/lib/data";
import { ReadingOverlay } from "@/components/dom/ReadingOverlay";
import { SlideController } from "@/components/dom/SlideController";
import { UIOverlay } from "@/components/dom/UIOverlay";

export default async function Page() {
  const posts = await getPosts();
  const authorInfo = await getAuthorInfo();
  const friendLinks = await getFriendLinks();

  return (
    <SlideController>
      <UIOverlay
        posts={posts}
        authorInfo={authorInfo}
        friendLinks={friendLinks}
      />
      <ReadingOverlay posts={posts} />
    </SlideController>
  );
}
