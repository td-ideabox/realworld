/**
 * Utility functions for handling user avatars
 */

interface RandomCatResponse {
  file: string;
}

/**
 * Fetches a random cat image URL from the RandomCat API
 * @returns Promise that resolves to a random cat image URL
 */
export async function getRandomCatImageUrl(): Promise<string> {
  try {
    const response = await fetch('https://aws.random.cat/meow');
    if (!response.ok) {
      throw new Error(`RandomCat API returned status ${response.status}`);
    }
    const data: RandomCatResponse = await response.json();
    return data.file;
  } catch (error) {
    // Fallback to a static placeholder if the API fails
    console.error('Failed to fetch random cat image:', error);
    return 'https://api.dicebear.com/7.x/cats/svg?seed=default';
  }
}

/**
 * Returns the provided image URL or a random cat image if null/empty
 * @param imageUrl - The user's avatar URL (may be null or empty)
 * @returns Promise that resolves to a valid image URL
 */
export async function getAvatarUrl(imageUrl: string | null | undefined): Promise<string> {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  return getRandomCatImageUrl();
}
