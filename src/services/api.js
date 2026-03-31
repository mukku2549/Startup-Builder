export const fetchIdeas = async () => {
  try {
    const response = await fetch('https://dummyjson.com/posts?limit=100');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.body,
      tags: post.tags,
    }));
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
    throw error;
  }
};

export const fetchRandomIdea = async () => {
  try {
    // Generate a random post ID between 1 and 150 (dummyjson currently has 150 posts)
    const randomId = Math.floor(Math.random() * 150) + 1;
    const response = await fetch(`https://dummyjson.com/posts/${randomId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const post = await response.json();
    return {
      id: post.id,
      title: post.title,
      description: post.body,
      tags: post.tags,
    };
  } catch (error) {
    console.error("Failed to fetch random idea:", error);
    throw error;
  }
};
