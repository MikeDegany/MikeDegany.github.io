export function getYouTubeVideoId(url: string): string | null {
  const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/, /youtube\.com\/embed\/([^&\n?#]+)/]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

/**
 * Generate YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Get YouTube embed URL from any YouTube URL format
 */
export function convertToYouTubeEmbed(url: string): string | null {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null
  return getYouTubeEmbedUrl(videoId)
}
