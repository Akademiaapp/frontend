class MyClass<T> {
	private name: string;
	private age: number;
	private data: T;

	constructor(name: string, age: number, data: T) {
		this.name = name;
		this.age = age;
		this.data = data;
	}

	public sayHello(): void {
		console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
	}

	public getData(): T {
		return this.data;
	}
}

const myObject = new MyClass('John', 25, 'Some data');
myObject.sayHello();
console.log(myObject.getData());

console.log(myObject instanceof MyClass<number>);
