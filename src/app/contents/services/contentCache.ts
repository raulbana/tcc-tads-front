import { Content, ContentCategory } from '@/app/types/content';

interface CacheData {
  contents: Content[];
  categories: ContentCategory[];
  contentById: Record<string, Content>;
}

class ContentCache {
  private cache: CacheData = {
    contents: [],
    categories: [],
    contentById: {},
  };

  getContents(): Content[] | null {
    return this.cache.contents.length > 0 ? this.cache.contents : null;
  }

  setContents(contents: Content[]): void {
    this.cache.contents = contents;
  }

  getContent(contentId: string): Content | null {
    return this.cache.contentById[contentId] || null;
  }

  setContent(contentId: string, content: Content): void {
    this.cache.contentById[contentId] = content;
  }

  getCategories(): ContentCategory[] | null {
    return this.cache.categories.length > 0 ? this.cache.categories : null;
  }

  setCategories(categories: ContentCategory[]): void {
    this.cache.categories = categories;
  }

  invalidateContent(contentId: string): void {
    delete this.cache.contentById[contentId];
  }

  clearContents(): void {
    this.cache.contents = [];
  }

  clearCategories(): void {
    this.cache.categories = [];
  }

  invalidateAll(): void {
    this.cache = {
      contents: [],
      categories: [],
      contentById: {},
    };
  }

  clearAll(): void {
    this.invalidateAll();
  }
}

export const contentCache = new ContentCache();