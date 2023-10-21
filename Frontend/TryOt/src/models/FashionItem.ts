//entire fashion item model (API에서 받아오는 데이터)
export interface FashionItem {
  id: string;
  itemUrl: string;
  imageUrl: string[];
  brand: string;
  shortDescription: string;
  description: string;
  category: string;
  gender: string;
  price: number;
}

const sampleFashionItem: FashionItem[] = [
  {
    id: '20934097',
    itemUrl:
      'https://www.farfetch.com/kr/shopping/women/sacai-quilted-layered-wool-coat-item-20934097.aspx?storeid=12045https://www.farfetch.com/kr/shopping/women/sacai-quilted-layered-wool-coat-item-20934097.aspx?storeid=12045',
    imageUrl: [
      'https://cdn-images.farfetch-contents.com/20/93/40/97/20934097_50966688_500.jpg',
    ],
    shortDescription: 'quilted layered wool coat',
    description:
      'quilted layered wool coat from sacai featuring light beige, wool, layered design, padded panels, quilted panels, throat latch, epaulettes, rounded collar, funnel neck, double-breasted button fastening, concealed front fastening, long sleeves, belted cuffs, belted waist, two side welt pockets, side press-stud fastening, inverted pleat, straight hem and mid-length.',
    category: 'Coats',
    price: 3181,
    gender: 'Women',
    brand: 'Sacai',
  },
];
export default sampleFashionItem;
