import { mapFullImageUrl } from '../util/dataMapping.js';

export const bananaResults = {
	results: [
		{
			id: 9040,
			name: 'banana',
			image: 'bananas.jpg'
		},
		{
			id: 10011111,
			name: 'banana leaves',
			image: 'banana-leaf.jpg'
		},
		{
			id: 19400,
			name: 'banana chips',
			image: 'banana-chips.jpg'
		},
		{
			id: 18019,
			name: 'banana bread',
			image: 'quick-bread.png'
		},
		{
			id: 11976,
			name: 'banana pepper',
			image: 'wax-peppers.png'
		},
		{
			id: 10211643,
			name: 'pink banana squash',
			image: 'pink-banana-squash.jpg'
		},
		{
			id: 98987,
			name: 'banana blossoms',
			image: 'banana-blossoms.jpg'
		},
		{
			id: 98903,
			name: 'banana pepper rings',
			image: 'wax-peppers.png'
		},
		{
			id: 93779,
			name: 'banana liqueur',
			image: 'limoncello.jpg'
		},
		{
			id: 14211111,
			name: 'banana extract',
			image: 'extract.png'
		}
	],
	offset: 0,
	number: 10,
	totalResults: 14
};

const bananaResultsWithImages = mapFullImageUrl(bananaResults.results);

export const banana = bananaResultsWithImages[1];
export const bananas = bananaResultsWithImages;
