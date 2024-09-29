// class SimpleClass {
// 	constructor(public property: string) {
// 		this.property += ' ' + this.newProp;
// 		console.log(this.newProp);
// 	}

import { EQ } from './compare';

// 	get newProp() {
// 		return this.constructor.name.toLowerCase();
// 	}

// 	display(): void {
// 		console.log(this.property);
// 	}
// }

// class ExtendedClass extends SimpleClass {}

// const extendedInstance = new ExtendedClass('hello');
// extendedInstance.display();

// const instance = new SimpleClass('hello');
// instance.display();

console.log(new EQ('name', 'John').realtime);
