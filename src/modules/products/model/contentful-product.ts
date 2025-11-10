export interface ContentfulProductFields {
  sys: Sys;
  total: number;
  skip: number;
  limit: number;
  items: Item[];
}

interface Item {
  metadata: Metadata;
  sys: Sys;
  fields: Fields;
}

interface Fields {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
}

interface Sys {
  space: Space;
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: Space;
  publishedVersion: number;
  revision: number;
  contentType: Space;
  locale: string;
}

interface Space {
  sys: Sys;
}

interface Sys {
  type: string;
  linkType: string;
  id: string;
}

interface Metadata {
  tags: any[];
  concepts: any[];
}

interface Sys {
  type: string;
  linkType: string;
  id: string;
}
