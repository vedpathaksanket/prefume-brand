/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FragranceCategory = 
  | 'All'
  | 'Woody & Smoky'
  | 'Solar & Floral'
  | 'Spiced Oriental'
  | 'Aqua & Fresh';

export type BottleSize = '30ml' | '50ml' | '100ml';

export interface ScentAccord {
  name: string;
  percentage: number;
}

export interface ScentPyramid {
  top: string[];
  heart: string[];
  base: string[];
  topDesc?: string;
  heartDesc?: string;
  baseDesc?: string;
}

export interface Perfume {
  id: string;
  name: string;
  subtitle: string;
  category: FragranceCategory;
  concentration: 'Extrait de Parfum' | 'Eau de Parfum';
  oilPercentage: number;
  prices: Record<BottleSize, number>;
  defaultSize: BottleSize;
  description: string;
  olfactoryStory: string;
  pyramid: ScentPyramid;
  accords: ScentAccord[];
  sillage: 'Intimate' | 'Moderate' | 'Enveloping' | 'Monumental';
  longevity: string;
  season: string;
  ritual: string;
  image: string;
  isBestseller?: boolean;
}

export interface CartItem {
  id: string; // unique item id (perfumeId-size or kit-id)
  perfumeId?: string;
  name: string;
  size?: BottleSize;
  price: number;
  quantity: number;
  image: string;
  isDiscoveryKit?: boolean;
  kitVials?: string[];
  customMonogram?: string;
}
