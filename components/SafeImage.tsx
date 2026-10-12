import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

type SafeImageProps = Omit<ImageProps, 'src' | 'onError'> & {
  src: string
  fallbackSrc?: string
}

export default function SafeImage({ src, fallbackSrc = '/products/placeholder.svg', alt, ...props }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <Image
      {...props}
      alt={alt}
      src={currentSrc}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  )
}
