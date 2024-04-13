import { goto } from '$app/navigation';
import api from '.';
import { assignmentAnswerStore, currentFile, documentStore } from './apiStore';

export class FileInfo {
	id: string;
	name: string;
	data: { type: string; data: [] };
	created_at: string;
	updated_at: string;

	fileType: string = 'documents';

	store;

	constructor(info, store, fileType = 'documents') {
		this.fileType = fileType;
		this.id = info.id;
		this.name = info.name;
		this.data = info.data;
		this.created_at = info.created_at;
		this.updated_at = info.updated_at;

		this.store = store;
	}

	get path() {
		return `/${this.fileType}/${this.id}`;
	}

	_rename: (newName: string) => void = api.debounce((newName: string) => {
		return this.updateInfo({ name: newName == '' ? 'Uden titel' : newName });
	});

	rename(newName: string) {
		this._rename(newName);
	}

	open() {
		currentFile.set(this);
		console.log(`going to /workspace/editor?id=${this.id}?type=${this.fileType}`);
		goto(`/workspace/editor?id=${this.id}?type=${this.fileType}`);
	}

	delete() {
		documentStore.update((files) => files.filter((file) => file.id !== this.id));
		return api.callApi(this.path, {}, 'DELETE');
	}

	addUser(user_email: string) {
		return api.callApi(
			this.path + '/users',
			{
				user_email
			},
			'PUT'
		);
	}

	// Gets the members of the file from the api
	async getMembers() {
		const res = await api.callApi(this.path + '/users');
		const json = await res.json();
		return json;
	}

	// Requests the api to update information
	updateInfo(info) {
		return api.callApi(this.path, info, 'PUT');
	}
}

export class DocumentInfo extends FileInfo {
	fileType = 'documents';
	isNote: boolean;

	constructor(info, store) {
		super(info, 'documents', store);
		this.isNote = info.isNote;
	}
}

export enum AssignmentProgress {
	NOT_STARTED,
	IN_PROGRESS,
	SUBMITTED,
	GRADED
}

export class Assignment extends FileInfo {
	due_date: string;
	assignment_answers;
	asigned_groups_ids: string[];
	asigned_users_ids: string[];
	isPublic: boolean;
	teacherId: string;

	constructor(info, store) {
		super(info, store, 'assignments');
		this.due_date = info.due_date;
		this.assignment_answers = info.assignment_answers;
		this.asigned_groups_ids = info.asigned_groups_ids;
		this.asigned_users_ids = info.asigned_users_ids;
		this.isPublic = info.isPublic;
		this.teacherId = info.teacherId;
	}

	async getMembers() {
		return [];
	}

	async getAnswers() {
		const res = await api.callApi(this.path + '/submitted');
		const json = await res.json();
		return json;
	}

	async assign() {
		this.isPublic = true;
		return api.callApi(this.path + '/deploy', null, 'POST');
	}

	rename(newName) {
		this.store.update((assignments) => {
			const index = assignments.findIndex((assignment) => assignment.id === this.id);
			if (index == -1) return assignments;
			assignments[index].name = newName;
			return assignments;
		});
		return super.rename(newName);
	}
}

export class AssignmentAnswer extends FileInfo {
	progress: AssignmentProgress;
	assignment_id: string;
	due_date: string;
	assignment_answers;
	asigned_groups_ids: string[];
	isPublic: boolean;
	teacherId: string;
	grade: number | null;
	feedback: string | null;

	constructor(info, store) {
		super(info, store, 'assignmentAnswers');
		this.assignment_answers = info.assignment_answers;
		this.asigned_groups_ids = info.asigned_groups_ids;
		this.isPublic = info.isPublic;
		this.teacherId = info.teacherId;
		this.due_date = info.due_date;
		this.assignment_id = info.assignment_id;
		this.progress = AssignmentProgress[info.status as keyof typeof AssignmentProgress];
		this.store = assignmentAnswerStore;
		this.grade = info.grade;
		this.feedback = info.feedback;
	}

	async getMembers() {
		return [];
	}

	async setGrade(grade: number, feedback: string) {
		this.grade = grade;
		this.feedback = feedback;
		return api.callApi(this.path, { grade, feedback }, 'PUT');
	}

	// rename(newName) {
	// 	assignmentAnswerStore.update((assignments) => {
	// 		const index = assignments.findIndex((assignment) => assignment.id === this.id);
	// 		if (index == -1) return assignments;
	// 		assignments[index].name = newName;
	// 		return assignments;
	// 	});
	// 	return super.rename(newName);
	// }
}

export class Folder {
	name: string;
	subFolders: Folder[];
	files: FileInfo[];
	emoji: string = '';

	constructor(info: { name: string; subFolders: Folder[]; files: FileInfo[]; emoji?: string }) {
		this.name = info.name;
		this.subFolders = info.subFolders;
		this.files = info.files;
		if (info.emoji) {
			this.emoji = info.emoji;
		}
	}
}
