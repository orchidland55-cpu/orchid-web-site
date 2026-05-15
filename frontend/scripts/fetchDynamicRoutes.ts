const BASE_URL = 'https://orchid-web-site-production.up.railway.app'

// ✅ Interfaces pour typer les réponses
interface Article {
  _id: string
}

interface Property {
  _id: string
}

export async function fetchDynamicRoutes(): Promise<string[]> {
  try {
    const [articlesRes, propertiesRes] = await Promise.all([
      fetch(`${BASE_URL}/articles`),
      fetch(`${BASE_URL}/properties`),
    ])

    // ✅ On type explicitement avec "as"
    const articlesData = await articlesRes.json() as Article[] | { data: Article[] }
    const propertiesData = await propertiesRes.json() as Property[] | { data: Property[] }

    const articles = Array.isArray(articlesData) ? articlesData : articlesData.data
    const properties = Array.isArray(propertiesData) ? propertiesData : propertiesData.data

    const blogRoutes = articles.map((a) => `/blog/${a._id}`)
    const propertyRoutes = properties.map((p) => `/properties/${p._id}`)

    console.log(`✅ ${blogRoutes.length} articles | ${propertyRoutes.length} propriétés`)

    return [...blogRoutes, ...propertyRoutes]
  } catch (error) {
    console.error('❌ Erreur fetch routes dynamiques:', error)
    return []
  }
}