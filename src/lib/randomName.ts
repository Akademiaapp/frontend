import word_list from './word_list';

// Returns a random name for the document in the format of correct horse battery staple
export default function randomName(): string {
	let name = '';
	for (let i = 0; i < 4; i++) {
		const index = Math.floor(Math.random() * word_list.length);
		name += word_list[index].charAt(0).toUpperCase() + word_list[index].slice(1);
		if (i !== 3) {
			name += '-';
		}
	}
	return name;
}
