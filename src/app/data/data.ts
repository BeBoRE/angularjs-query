export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export const fetchPosts = async (search: string, page?: number, limit = 10) => {
  const url = new URL("https://690b42d56ad3beba00f425c0.mockapi.io/post");

  if (search) {
    url.searchParams.append("filter", search);
  }

  if (page) {
    url.searchParams.append("page", page.toString(10));
    url.searchParams.append("limit", limit.toString(10));
  }

  //await new Promise((res) => setTimeout(res, 2000));

  const result = await fetch(url).then((res) => {
    if (res.status === 404) return [];

    return res.json();
  });

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
