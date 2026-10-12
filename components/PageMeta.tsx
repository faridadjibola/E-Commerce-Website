import Head from 'next/head'
import { normalizeCanonicalPath, SITE_URL } from '../lib/metadata'

type PageMetaProps = {
  title: string
  description: string
  keywords?: string
  canonicalPath?: string
}

export default function PageMeta({ title, description, keywords, canonicalPath }: PageMetaProps) {
  const fullTitle = `${title} | Tochiwears`
  const path = normalizeCanonicalPath(canonicalPath || '/')
  const canonical = `${SITE_URL}${path}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Tochiwears" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Head>
  )
}
