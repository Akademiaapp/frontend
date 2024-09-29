export class Compare {
	colomn;
	value;

	realtime: string;
	constructor(colomn, value) {
		this.colomn = colomn;
		this.value = value;

		this.realtime = `${this.colomn}=${this.name}.${this.value}`;
	}

	get name() {
		return this.constructor.name.toLowerCase();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	check(value): boolean {
		return true;
	}

	checkRow(row) {
		return this.check(row[this.colomn]);
	}

	query(q) {
		return q;
	}
}

export class EQ extends Compare {
	override check(value): boolean {
		return value === this.value;
	}

	override query(q) {
		return q.eq(this.colomn, this.value);
	}
}
