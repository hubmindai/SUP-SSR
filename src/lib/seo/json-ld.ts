/**
 * JSON-LD builders · schema.org structured data
 *
 * Eight generators corresponding to the eight types in SUP-SSR-013:
 * Organization · WebSite · Article · FAQPage · HowTo · Product
 * BreadcrumbList · Person
 *
 * Each returns a JSON.stringify-able object. Wrap with `jsonLdScript()`
 * to produce the <script type="application/ld+json"> string for head().
 */

const CTX = "https://schema.org" as const;

export type SameAs = string[];

export interface OrgInput {
  name: string;
  url: string;
  logo?: string;
  sameAs?: SameAs;
  description?: string;
}

export function organization(input: OrgInput) {
  return {
    "@context": CTX,
    "@type": "Organization",
    name: input.name,
    url: input.url,
    ...(input.logo ? { logo: input.logo } : {}),
    ...(input.sameAs ? { sameAs: input.sameAs } : {}),
    ...(input.description ? { description: input.description } : {}),
  };
}

export interface WebSiteInput {
  name: string;
  url: string;
  searchUrlTemplate?: string; // e.g. "https://site.com/search?q={search_term_string}"
}

export function webSite(input: WebSiteInput) {
  return {
    "@context": CTX,
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    ...(input.searchUrlTemplate
      ? {
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: input.searchUrlTemplate,
            },
            "query-input": "required name=search_term_string",
          },
        }
      : {}),
  };
}

export interface ArticleInput {
  headline: string;
  description?: string;
  author: { name: string; url?: string };
  datePublished: string; // ISO
  dateModified?: string;
  image?: string | string[];
  publisher?: { name: string; logo?: string };
  url: string;
}

export function article(input: ArticleInput) {
  return {
    "@context": CTX,
    "@type": "Article",
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    author: {
      "@type": "Person",
      name: input.author.name,
      ...(input.author.url ? { url: input.author.url } : {}),
    },
    datePublished: input.datePublished,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.publisher
      ? {
          publisher: {
            "@type": "Organization",
            name: input.publisher.name,
            ...(input.publisher.logo
              ? { logo: { "@type": "ImageObject", url: input.publisher.logo } }
              : {}),
          },
        }
      : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
  };
}

export interface FaqQa {
  q: string;
  a: string;
}

export function faqPage(items: FaqQa[]) {
  return {
    "@context": CTX,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

export interface HowToInput {
  name: string;
  description?: string;
  totalTime?: string; // ISO 8601 duration e.g. "PT15M"
  estimatedCost?: { currency: string; value: string };
  steps: HowToStep[];
}

export function howTo(input: HowToInput) {
  return {
    "@context": CTX,
    "@type": "HowTo",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    ...(input.estimatedCost
      ? {
          estimatedCost: {
            "@type": "MonetaryAmount",
            currency: input.estimatedCost.currency,
            value: input.estimatedCost.value,
          },
        }
      : {}),
    step: input.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.image ? { image: step.image } : {}),
      ...(step.url ? { url: step.url } : {}),
    })),
  };
}

export interface ProductInput {
  name: string;
  description: string;
  image?: string | string[];
  sku?: string;
  brand?: { name: string };
  offer?: {
    price: string;
    currency: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder";
    url: string;
    priceValidUntil?: string;
  };
  aggregateRating?: { ratingValue: string; reviewCount: number };
}

export function product(input: ProductInput) {
  return {
    "@context": CTX,
    "@type": "Product",
    name: input.name,
    description: input.description,
    ...(input.image ? { image: input.image } : {}),
    ...(input.sku ? { sku: input.sku } : {}),
    ...(input.brand
      ? { brand: { "@type": "Brand", name: input.brand.name } }
      : {}),
    ...(input.offer
      ? {
          offers: {
            "@type": "Offer",
            price: input.offer.price,
            priceCurrency: input.offer.currency,
            availability: `https://schema.org/${input.offer.availability ?? "InStock"}`,
            url: input.offer.url,
            ...(input.offer.priceValidUntil
              ? { priceValidUntil: input.offer.priceValidUntil }
              : {}),
          },
        }
      : {}),
    ...(input.aggregateRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: input.aggregateRating.ratingValue,
            reviewCount: input.aggregateRating.reviewCount,
          },
        }
      : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function breadcrumb(items: BreadcrumbItem[]) {
  return {
    "@context": CTX,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export interface PersonInput {
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  sameAs?: SameAs;
}

export function person(input: PersonInput) {
  return {
    "@context": CTX,
    "@type": "Person",
    name: input.name,
    ...(input.url ? { url: input.url } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.sameAs ? { sameAs: input.sameAs } : {}),
  };
}

/**
 * Render a JSON-LD payload as a script-tag string ready to drop into
 * head().scripts or a route's head() return value.
 */
export function jsonLdScript(payload: unknown): {
  type: "application/ld+json";
  children: string;
} {
  return {
    type: "application/ld+json",
    children: JSON.stringify(payload),
  };
}
