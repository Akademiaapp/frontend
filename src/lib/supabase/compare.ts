class compare {
	colomn;
	value;
	constructor(colomn, value) {
		this.colomn = colomn;
		this.value = value;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	check(colomn, value): boolean {
		return true;
	}

	query(q) {
		return q;
	}
}

export class EQ extends compare {
	check(colomn, value): boolean {
		return colomn === this.colomn && value === this.value;
	}

	query(q) {
		return q.eq(this.colomn, this.value);
	}
}
