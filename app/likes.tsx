"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type Props = {
  tweet: {
    user_has_liked_tweet: boolean;
    likes: number;
    created_at: string;
    id: string;
    title: string;
    user_id: string;
    profiles: {
      avatar_url: string | null;
      created_at: string;
      id: string;
      name: string | null;
      username: string;
    } | null;
  };
};

export default function Likes({ tweet }: Props) {
  const router = useRouter();

  const handleLikes = async () => {
    const supabase = createClientComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      if (tweet.user_has_liked_tweet) {
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id });
      } else {
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet.id });
      }
      router.refresh();
    }
  };

  return <button onClick={handleLikes}>{tweet.likes} Likes</button>;
}
