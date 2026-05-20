const BASE_URL = 'https://orchid-web-site-production.up.railway.app'

interface Article {
  _id: string
  slug?: string
  status?: string
}

interface Property {
  _id: string
  slug?: string
  status?: string
}

export async function fetchDynamicRoutes(): Promise<string[]> {
  try {
    const [articlesRes, propertiesRes] = await Promise.all([
      fetch(`${BASE_URL}/articles`),
      fetch(`${BASE_URL}/properties`),
    ])

    const articlesData  = await articlesRes.json()  as Article[]  | { data: Article[] }
    const propertiesData = await propertiesRes.json() as Property[] | { data: Property[] }

    const articles   = Array.isArray(articlesData)   ? articlesData   : articlesData.data
    const properties = Array.isArray(propertiesData) ? propertiesData : propertiesData.data

    // ✅ Slug en priorité, _id en fallback (rétrocompatibilité)
    const blogRoutes = articles
      .filter((a) => a.status === 'published')        // uniquement les articles publiés
      .map((a) => `/${a.slug || a._id}/`)

    const propertyRoutes = properties
      .filter((p) => p.status === 'available' || p.status === 'sold') // exclut les drafts
      .map((p) => `/property/${p.slug || p._id}/`)

    console.log(`✅ ${blogRoutes.length} articles | ${propertyRoutes.length} propriétés`)

    return [...blogRoutes, ...propertyRoutes]
  } catch (error) {
    console.error('❌ Erreur fetch routes dynamiques:', error)
    return []
  }
}