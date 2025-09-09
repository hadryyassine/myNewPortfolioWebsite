import site from '../data/site'

export default function SEO({
  title,
  description = site.description,
  url = site.baseUrl,
  image = site.ogImage,
  type = 'website',
  noindex = false,
}) {
  const fullTitle = title ? `${title} — ${site.name}` : site.title
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* canonical */}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {site.twitter && <meta name="twitter:site" content={site.twitter} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
