export function generateArticleSchema(article: {
  title: string
  description?: string
  image?: string
  publishedAt?: Date
  updatedAt: Date
  author: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'كيان مزلات',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kayan-mazalat.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'كيان مزلات',
    alternateName: 'Kayan Mazalat',
    url: 'https://kayan-mazalat.com',
    logo: 'https://kayan-mazalat.com/logo.png',
    description: 'شركة متخصصة في الألواح الساندويتش والبناء الحديث في المملكة العربية السعودية',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SA',
      addressLocality: 'الرياض',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+966537639422',
      contactType: 'customer service',
      availableLanguage: ['ar', 'en'],
    },
    sameAs: [
      'https://twitter.com/kayan-mazalat',
      'https://facebook.com/kayan-mazalat',
      'https://instagram.com/kayan-mazalat',
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'كيان مزلات',
    url: 'https://kayan-mazalat.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://kayan-mazalat.com/blog?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
