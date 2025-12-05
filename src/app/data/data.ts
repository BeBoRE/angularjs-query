type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export const fetchPosts = async () => {
  const result = await fetch(
    "https://690b42d56ad3beba00f425c0.mockapi.io/post"
  ).then((res) => res.json());

  return result as Post[];
};

export const addPost = async (post: Omit<Post, "id">) => {
  const result = await fetch(
    "https://690b42d56ad3beba00f425c0.mockapi.io/post",
    {
      method: "POST",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  console.log(result);
  return result as Post;
};
