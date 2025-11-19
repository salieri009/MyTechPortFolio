/**
 * Profile Image Configuration
 * 
 * 20-year Frontend Engineer Best Practices:
 * - Centralized image path management
 * - Support for multiple image variants (sizes, formats)
 * - Easy maintenance and updates
 * - Type-safe image references
 * 
 * @author MyTechPortfolio Team
 * @since 1.0.0
 */

/**
 * Profile image size variants
 * Following responsive image best practices
 */
export enum ProfileImageSize {
  /** Thumbnail: 96x96px - For small avatars, lists */
  THUMBNAIL = 'thumbnail',
  /** Small: 192x192px - For mobile profile displays */
  SMALL = 'small',
  /** Medium: 320x320px - Default desktop profile display */
  MEDIUM = 'medium',
  /** Large: 512x512px - High-resolution displays */
  LARGE = 'large',
  /** Original: Full resolution - For download or print */
  ORIGINAL = 'original'
}

/**
 * Image format variants
 * Modern formats for better performance
 */
export enum ProfileImageFormat {
  /** WebP - Modern format with excellent compression */
  WEBP = 'webp',
  /** AVIF - Next-gen format with superior compression */
  AVIF = 'avif',
  /** JPEG - Fallback for older browsers */
  JPEG = 'jpg',
  /** PNG - For images with transparency */
  PNG = 'png'
}

/**
 * Profile image configuration
 * Centralized configuration for all profile images
 */
export interface ProfileImageConfig {
  /** Base path for profile images */
  basePath: string
  /** Default image filename */
  defaultImage: string
  /** Fallback image (placeholder) */
  fallbackImage: string
  /** Image variants mapping */
  variants: Record<ProfileImageSize, string>
  /** Supported formats */
  formats: ProfileImageFormat[]
}

/**
 * Default profile image configuration
 * 
 * Structure:
 * public/images/profile/
 *   ├── profile.jpg (default/original)
 *   ├── profile.webp
 *   ├── profile.avif
 *   └── variants/
 *       ├── thumbnail/
 *       │   ├── profile-thumbnail.jpg
 *       │   ├── profile-thumbnail.webp
 *       │   └── profile-thumbnail.avif
 *       ├── small/
 *       ├── medium/
 *       ├── large/
 *       └── original/
 */
export const PROFILE_IMAGE_CONFIG: ProfileImageConfig = {
  basePath: '/images/profile',
  defaultImage: 'profile.jpg',
  fallbackImage: 'profile-fallback.svg',
  variants: {
    [ProfileImageSize.THUMBNAIL]: 'variants/thumbnail/profile-thumbnail',
    [ProfileImageSize.SMALL]: 'variants/small/profile-small',
    [ProfileImageSize.MEDIUM]: 'variants/medium/profile-medium',
    [ProfileImageSize.LARGE]: 'variants/large/profile-large',
    [ProfileImageSize.ORIGINAL]: 'profile'
  },
  formats: [
    ProfileImageFormat.AVIF,
    ProfileImageFormat.WEBP,
    ProfileImageFormat.JPEG
  ]
}

/**
 * Get profile image path
 * 
 * @param size - Image size variant (default: MEDIUM)
 * @param format - Image format (default: JPEG for compatibility)
 * @returns Full path to the profile image
 * 
 * @example
 * ```ts
 * getProfileImagePath(ProfileImageSize.MEDIUM, ProfileImageFormat.WEBP)
 * // Returns: '/images/profile/variants/medium/profile-medium.webp'
 * ```
 */
export function getProfileImagePath(
  size: ProfileImageSize = ProfileImageSize.MEDIUM,
  format: ProfileImageFormat = ProfileImageFormat.JPEG
): string {
  const variantPath = PROFILE_IMAGE_CONFIG.variants[size]
  const extension = format === ProfileImageFormat.JPEG ? 'jpg' : format
  return `${PROFILE_IMAGE_CONFIG.basePath}/${variantPath}.${extension}`
}

/**
 * Get profile image srcset for responsive images
 * 
 * @param sizes - Array of image sizes to include
 * @param format - Image format (default: WEBP for modern browsers)
 * @returns srcset string for <img srcset> attribute
 * 
 * @example
 * ```ts
 * getProfileImageSrcSet([ProfileImageSize.SMALL, ProfileImageSize.MEDIUM, ProfileImageSize.LARGE])
 * // Returns: '/images/profile/variants/small/profile-small.webp 192w, /images/profile/variants/medium/profile-medium.webp 320w, /images/profile/variants/large/profile-large.webp 512w'
 * ```
 */
export function getProfileImageSrcSet(
  sizes: ProfileImageSize[] = [
    ProfileImageSize.SMALL,
    ProfileImageSize.MEDIUM,
    ProfileImageSize.LARGE
  ],
  format: ProfileImageFormat = ProfileImageFormat.WEBP
): string {
  const sizeMap: Record<ProfileImageSize, string> = {
    [ProfileImageSize.THUMBNAIL]: '96w',
    [ProfileImageSize.SMALL]: '192w',
    [ProfileImageSize.MEDIUM]: '320w',
    [ProfileImageSize.LARGE]: '512w',
    [ProfileImageSize.ORIGINAL]: '1024w'
  }

  return sizes
    .map(size => {
      const path = getProfileImagePath(size, format)
      const width = sizeMap[size]
      return `${path} ${width}`
    })
    .join(', ')
}

/**
 * Get profile image with fallback
 * Returns the default image path, with fallback handling
 * 
 * @param size - Image size variant (default: MEDIUM)
 * @returns Default profile image path
 */
export function getDefaultProfileImage(
  size: ProfileImageSize = ProfileImageSize.MEDIUM
): string {
  return getProfileImagePath(size, ProfileImageFormat.JPEG)
}

/**
 * Get profile image sources for <picture> element
 * Returns array of source objects for modern image formats
 * 
 * @param size - Image size variant (default: MEDIUM)
 * @returns Array of source objects with type and srcset
 * 
 * @example
 * ```ts
 * const sources = getProfileImageSources(ProfileImageSize.MEDIUM)
 * // Returns: [
 * //   { type: 'image/avif', srcset: '...' },
 * //   { type: 'image/webp', srcset: '...' },
 * //   { type: 'image/jpeg', srcset: '...' }
 * // ]
 * ```
 */
export function getProfileImageSources(
  size: ProfileImageSize = ProfileImageSize.MEDIUM
): Array<{ type: string; srcset: string }> {
  return PROFILE_IMAGE_CONFIG.formats.map(format => {
    const mimeTypes: Record<ProfileImageFormat, string> = {
      [ProfileImageFormat.AVIF]: 'image/avif',
      [ProfileImageFormat.WEBP]: 'image/webp',
      [ProfileImageFormat.JPEG]: 'image/jpeg',
      [ProfileImageFormat.PNG]: 'image/png'
    }

    return {
      type: mimeTypes[format],
      srcset: getProfileImagePath(size, format)
    }
  })
}

/**
 * Profile image utility functions
 * Helper functions for common image operations
 */
export const ProfileImageUtils = {
  /**
   * Check if image exists (client-side check)
   * Note: This is a basic check, actual existence should be verified server-side
   */
  imageExists: (path: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = path
    })
  },

  /**
   * Get responsive image sizes attribute
   * For use with srcset
   */
  getSizes: (): string => {
    return '(max-width: 768px) 192px, (max-width: 1024px) 240px, 320px'
  },

  /**
   * Generate placeholder data URL
   * Creates a simple SVG placeholder for loading states
   */
  generatePlaceholder: (width: number = 320, height: number = 320, isDark: boolean = false): string => {
    const bgColor = isDark ? '#1F2937' : '#F3F4F6'
    const iconColor = isDark ? '#6B7280' : '#9CA3AF'
    
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${bgColor}"/>
        <circle cx="${width / 2}" cy="${width / 3}" r="${width / 8}" fill="${iconColor}"/>
        <path d="M${width / 4} ${width / 1.5} Q${width / 2} ${width / 1.2} ${width * 3 / 4} ${width / 1.5}" stroke="${iconColor}" stroke-width="2" fill="none"/>
      </svg>
    `.trim()
    
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }
}

/**
 * Default export for convenience
 */
export default {
  PROFILE_IMAGE_CONFIG,
  ProfileImageSize,
  ProfileImageFormat,
  getProfileImagePath,
  getProfileImageSrcSet,
  getDefaultProfileImage,
  getProfileImageSources,
  ProfileImageUtils
}

