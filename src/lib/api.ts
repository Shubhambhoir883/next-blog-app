import { Post, PostsResponse, TagItem } from "@/types/blog";

const BASE_URL = "https://dummyjson.com/posts";

export async function getPosts(options?: {
  limit?: number;
  skip?: number;
  tag?: string;
  query?: string;
}): Promise<PostsResponse> {
  const limit = options?.limit ?? 9;
  const skip = options?.skip ?? 0;

  let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;

  if (options?.query && options.query.trim()) {
    url = `${BASE_URL}/search?q=${encodeURIComponent(options.query.trim())}&limit=${limit}&skip=${skip}`;
  } else if (options?.tag && options.tag.trim()) {
    url = `${BASE_URL}/tag/${encodeURIComponent(options.tag.trim())}?limit=${limit}&skip=${skip}`;
  }

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch posts from DummyJSON (${res.status}: ${res.statusText})`);
  }

  return res.json();
}

export async function getPostById(id: string | number): Promise<Post | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch post #${id}`);
    }

    return res.json();
  } catch (err) {
    console.error("Error fetching single post:", err);
    return null;
  }
}

export async function getPopularTags(): Promise<TagItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/tags`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 10) : [];
  } catch (err) {
    console.error("Error fetching tags:", err);
    return [];
  }
}
