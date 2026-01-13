export type StyleCategory =
  | 'Streetwear'
  | 'Casual'
  | 'Formal'
  | 'Vintage'
  | 'Luxury'
  | 'Gender-neutral';

export type Outfit = {
  id: string;
  imageUrl: string;
  imageThumbUrl: string;
  photographer?: string;
  sourceUrl?: string;
  category: StyleCategory;
  title: string;
  description: string;
  items: {
    top: string;
    bottom: string;
    shoes: string;
    accessories: string[];
  };
  tips: string[];
};

type UnsplashSearchResponse = {
  total: number;
  total_pages: number;
  results: Array<{
    id: string;
    alt_description: string | null;
    description: string | null;
    links: { html: string };
    user: { name: string };
    urls: { regular: string; small: string };
  }>;
};

const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

const CATEGORY_QUERY: Record<StyleCategory, string> = {
  Streetwear: 'streetwear outfit',
  Casual: 'casual outfit fashion',
  Formal: 'formal outfit fashion',
  Vintage: 'vintage outfit fashion',
  Luxury: 'luxury outfit fashion',
  'Gender-neutral': 'gender neutral fashion outfit',
};

const FALLBACK_SEED: Array<Pick<Outfit, 'category' | 'title' | 'description' | 'items' | 'tips'>> =
  [
    {
      category: 'Streetwear',
      title: 'Oversized hoodie + baggy denim',
      description: 'Cozy top, wide-leg denim, and crisp kicks. Keep the palette tight.',
      items: {
        top: 'Oversized hoodie',
        bottom: 'Baggy jeans',
        shoes: 'High-top sneakers',
        accessories: ['Beanie', 'Crossbody bag'],
      },
      tips: ['Go monochrome for a cleaner silhouette', 'Add one bold accessory color'],
    },
    {
      category: 'Casual',
      title: 'Minimal tee + relaxed trousers',
      description: 'Simple, sharp, effortless. Clean lines and a relaxed drape.',
      items: {
        top: 'Boxy tee',
        bottom: 'Relaxed trousers',
        shoes: 'Low-profile sneakers',
        accessories: ['Watch', 'Canvas tote'],
      },
      tips: ['Let the fit do the talking', 'Keep shoes bright for contrast'],
    },
    {
      category: 'Formal',
      title: 'Tailored blazer + straight slacks',
      description: 'Modern formal with a street edge—sharp shoulders, easy movement.',
      items: {
        top: 'Tailored blazer',
        bottom: 'Straight slacks',
        shoes: 'Loafers',
        accessories: ['Leather belt', 'Simple chain'],
      },
      tips: ['Try a tee instead of a shirt for a softer vibe', 'Match metals (belt buckle + jewelry)'],
    },
    {
      category: 'Vintage',
      title: 'Retro jacket + worn-in denim',
      description: 'Thrift-core texture with a balanced shape. Mix faded and solid pieces.',
      items: {
        top: 'Vintage jacket',
        bottom: 'Worn-in denim',
        shoes: 'Retro runners',
        accessories: ['Cap', 'Rings'],
      },
      tips: ['Mix one statement piece with basics', 'Cuff jeans to highlight the shoe'],
    },
    {
      category: 'Luxury',
      title: 'Clean layers + elevated sneakers',
      description: 'Quiet luxury with street details—premium fabric, subtle branding.',
      items: {
        top: 'Structured overshirt',
        bottom: 'Tapered trousers',
        shoes: 'Minimal leather sneakers',
        accessories: ['Sunglasses', 'Leather wallet'],
      },
      tips: ['Prioritize fabric texture', 'Keep logos minimal for a luxe feel'],
    },
    {
      category: 'Gender-neutral',
      title: 'Boxy layers + wide-leg pants',
      description: 'Shape-forward fit that works for everyone. Balance volume top and bottom.',
      items: {
        top: 'Boxy cropped jacket',
        bottom: 'Wide-leg pants',
        shoes: 'Chunky sneakers',
        accessories: ['Silver chain', 'Shoulder bag'],
      },
      tips: ['Layer neutrals, then add one accent', 'Try platform soles to elongate the look'],
    },
  ];

function clampPage(page: number) {
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.floor(page);
}

function safeCategory(category?: string): StyleCategory {
  const c = (category || '').toLowerCase();
  if (c === 'streetwear') return 'Streetwear';
  if (c === 'casual') return 'Casual';
  if (c === 'formal') return 'Formal';
  if (c === 'vintage') return 'Vintage';
  if (c === 'luxury') return 'Luxury';
  if (c === 'gender-neutral' || c === 'gender neutral' || c === 'neutral') return 'Gender-neutral';
  return 'Streetwear';
}

function fallbackImageFor(outfitId: string, category: StyleCategory) {
  // Unsplash Source endpoints do not require an API key.
  const q = encodeURIComponent(CATEGORY_QUERY[category]);
  const base = `https://source.unsplash.com/featured/?${q}`;
  return {
    regular: `${base}&sig=${encodeURIComponent(outfitId)}`,
    thumb: `${base}&sig=${encodeURIComponent(outfitId)}&w=600`,
  };
}

function makeFallbackOutfits(opts: {
  category?: StyleCategory;
  query?: string;
  page: number;
  perPage: number;
}): { outfits: Outfit[]; hasMore: boolean } {
  const { page, perPage } = opts;
  const category = opts.category || 'Streetwear';

  const seed = FALLBACK_SEED.filter((s) => s.category === category);
  const base = seed.length ? seed : FALLBACK_SEED;
  const start = (page - 1) * perPage;
  const slice = Array.from({ length: perPage }, (_, i) => base[(start + i) % base.length]).filter(
    Boolean
  );

  const q = (opts.query || '').trim().toLowerCase();
  const filtered = q
    ? slice.filter((s) => `${s.title} ${s.description}`.toLowerCase().includes(q))
    : slice;

  const outfits: Outfit[] = filtered.map((s, idx) => {
    const id = `fallback_${category}_${page}_${idx}`;
    const img = fallbackImageFor(id, s.category);
    return {
      id,
      category: s.category,
      title: s.title,
      description: s.description,
      items: s.items,
      tips: s.tips,
      imageUrl: img.regular,
      imageThumbUrl: img.thumb,
      sourceUrl: img.regular,
    };
  });

  return { outfits, hasMore: true };
}

export async function searchOutfits(opts: {
  category?: StyleCategory | string;
  query?: string;
  page?: number;
  perPage?: number;
}): Promise<{ outfits: Outfit[]; hasMore: boolean; source: 'unsplash' | 'fallback' }> {
  const page = clampPage(opts.page ?? 1);
  const perPage = Math.min(Math.max(opts.perPage ?? 10, 6), 30);
  const category = typeof opts.category === 'string' ? safeCategory(opts.category) : opts.category;
  const q = (opts.query || '').trim();

  const key = process.env.EXPO_PUBLIC_UNSPLASH_KEY;
  if (!key) {
    const r = makeFallbackOutfits({ category: category || 'Streetwear', query: q, page, perPage });
    return { ...r, source: 'fallback' };
  }

  const query = q.length ? q : CATEGORY_QUERY[category || 'Streetwear'];
  const url = new URL(`${UNSPLASH_BASE_URL}/search/photos`);
  url.searchParams.set('query', query);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(perPage));
  url.searchParams.set('orientation', 'portrait');

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${key}`,
      'Accept-Version': 'v1',
    },
  });

  if (!res.ok) {
    const r = makeFallbackOutfits({ category: category || 'Streetwear', query: q, page, perPage });
    return { ...r, source: 'fallback' };
  }

  const data = (await res.json()) as UnsplashSearchResponse;
  const outfits: Outfit[] = data.results.map((p) => {
    const categoryFinal = category || 'Streetwear';
    return {
      id: p.id,
      category: categoryFinal,
      title: p.alt_description?.trim() || 'Swaggy fit inspiration',
      description:
        p.description?.trim() ||
        'A curated look — mix textures, balance proportions, and keep the palette intentional.',
      items: {
        top: 'Statement top',
        bottom: 'Relaxed bottoms',
        shoes: 'Clean sneakers',
        accessories: ['Minimal jewelry', 'Bag'],
      },
      tips: ['Balance oversized with fitted', 'Repeat one color 2–3 times across the fit'],
      imageUrl: p.urls.regular,
      imageThumbUrl: p.urls.small,
      photographer: p.user?.name,
      sourceUrl: p.links?.html,
    };
  });

  const hasMore = page < (data.total_pages || 1);
  return { outfits, hasMore, source: 'unsplash' };
}

