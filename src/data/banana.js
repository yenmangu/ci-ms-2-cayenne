import { mapFullImageUrl } from '../util/dataMapping.js';

export const bananaResults = {
	number: 10,
	offset: 0,
	results: [
		{
			id: 9040,
			image: 'bananas.jpg',
			name: 'banana'
		},
		{
			id: 10011111,
			image: 'banana-leaf.jpg',
			name: 'banana leaves'
		},
		{
			id: 19400,
			image: 'banana-chips.jpg',
			name: 'banana chips'
		},
		{
			id: 18019,
			image: 'quick-bread.png',
			name: 'banana bread'
		},
		{
			id: 11976,
			image: 'wax-peppers.png',
			name: 'banana pepper'
		},
		{
			id: 10211643,
			image: 'pink-banana-squash.jpg',
			name: 'pink banana squash'
		},
		{
			id: 98987,
			image: 'banana-blossoms.jpg',
			name: 'banana blossoms'
		},
		{
			id: 98903,
			image: 'wax-peppers.png',
			name: 'banana pepper rings'
		},
		{
			id: 93779,
			image: 'limoncello.jpg',
			name: 'banana liqueur'
		},
		{
			id: 14211111,
			image: 'extract.png',
			name: 'banana extract'
		}
	],
	totalResults: 14
};

const bananaResultsWithImages = mapFullImageUrl(bananaResults.results);

export const banana = bananaResultsWithImages[1];
export const bananas = bananaResultsWithImages;
