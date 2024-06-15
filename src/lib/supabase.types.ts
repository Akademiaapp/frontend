export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			assignment: {
				Row: {
					assigned_group_ids: string[] | null;
					assigned_user_ids: string[] | null;
					content: string | null;
					created_at: string;
					due_date: string;
					id: string;
					is_public: boolean;
					name: string;
					teacher_id: string;
					updated_at: string;
				};
				Insert: {
					assigned_group_ids?: string[] | null;
					assigned_user_ids?: string[] | null;
					content?: string | null;
					created_at?: string;
					due_date: string;
					id?: string;
					is_public?: boolean;
					name: string;
					teacher_id: string;
					updated_at?: string;
				};
				Update: {
					assigned_group_ids?: string[] | null;
					assigned_user_ids?: string[] | null;
					content?: string | null;
					created_at?: string;
					due_date?: string;
					id?: string;
					is_public?: boolean;
					name?: string;
					teacher_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'assignment_teacher_id_fkey1';
						columns: ['teacher_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					}
				];
			};
			assignment_answer: {
				Row: {
					assignment_id: string;
					content: string | null;
					created_at: string;
					feedback_id: string | null;
					id: string;
					status: Database['public']['Enums']['assignment_status'];
					student_id: string;
					updated_at: string;
				};
				Insert: {
					assignment_id: string;
					content?: string | null;
					created_at?: string;
					feedback_id?: string | null;
					id?: string;
					status?: Database['public']['Enums']['assignment_status'];
					student_id: string;
					updated_at?: string;
				};
				Update: {
					assignment_id?: string;
					content?: string | null;
					created_at?: string;
					feedback_id?: string | null;
					id?: string;
					status?: Database['public']['Enums']['assignment_status'];
					student_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'assignment_answer_assignment_id_fkey';
						columns: ['assignment_id'];
						isOneToOne: false;
						referencedRelation: 'assignment';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'assignment_answer_feedback_id_fkey';
						columns: ['feedback_id'];
						isOneToOne: false;
						referencedRelation: 'assignment_feedback';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'assignment_answer_student_id_fkey1';
						columns: ['student_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					}
				];
			};
			assignment_feedback: {
				Row: {
					created_at: string;
					feedback: string | null;
					grade: number | null;
					id: string;
					is_public: boolean;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					feedback?: string | null;
					grade?: number | null;
					id?: string;
					is_public?: boolean;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					feedback?: string | null;
					grade?: number | null;
					id?: string;
					is_public?: boolean;
					updated_at?: string;
				};
				Relationships: [];
			};
			document: {
				Row: {
					content: string | null;
					created_at: string;
					id: string;
					isNote: boolean;
					name: string | null;
					updated_at: string;
				};
				Insert: {
					content?: string | null;
					created_at?: string;
					id?: string;
					isNote?: boolean;
					name?: string | null;
					updated_at?: string;
				};
				Update: {
					content?: string | null;
					created_at?: string;
					id?: string;
					isNote?: boolean;
					name?: string | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			file_permission: {
				Row: {
					created_at: string;
					file_id: string;
					id: string;
					permission: Database['public']['Enums']['permission'];
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					file_id: string;
					id?: string;
					permission?: Database['public']['Enums']['permission'];
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					file_id?: string;
					id?: string;
					permission?: Database['public']['Enums']['permission'];
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'file_permission_file_id_fkey';
						columns: ['file_id'];
						isOneToOne: false;
						referencedRelation: 'document';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'file_permission_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					}
				];
			};
			group: {
				Row: {
					created_at: string;
					id: string;
					name: string;
					school_id: string | null;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					name: string;
					school_id?: string | null;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					name?: string;
					school_id?: string | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'group_school_id_fkey';
						columns: ['school_id'];
						isOneToOne: false;
						referencedRelation: 'school';
						referencedColumns: ['id'];
					}
				];
			};
			school: {
				Row: {
					address: string | null;
					city: string | null;
					created_at: string;
					id: string;
					name: string;
					updated_at: string;
				};
				Insert: {
					address?: string | null;
					city?: string | null;
					created_at?: string;
					id?: string;
					name: string;
					updated_at?: string;
				};
				Update: {
					address?: string | null;
					city?: string | null;
					created_at?: string;
					id?: string;
					name?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			subjects: {
				Row: {
					icon: string | null;
					id: number;
					name: string;
					user_id: string;
				};
				Insert: {
					icon?: string | null;
					id?: number;
					name: string;
					user_id: string;
				};
				Update: {
					icon?: string | null;
					id?: number;
					name?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'subjects_user_id_fkey1';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					}
				];
			};
			user: {
				Row: {
					avatar_url: string | null;
					full_name: string | null;
					id: string;
					school_id: string | null;
					type: Database['public']['Enums']['user_type'] | null;
					username: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					full_name?: string | null;
					id: string;
					school_id?: string | null;
					type?: Database['public']['Enums']['user_type'] | null;
					username?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					full_name?: string | null;
					id?: string;
					school_id?: string | null;
					type?: Database['public']['Enums']['user_type'] | null;
					username?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'user_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'user_school_id_fkey';
						columns: ['school_id'];
						isOneToOne: false;
						referencedRelation: 'school';
						referencedColumns: ['id'];
					}
				];
			};
			user_group: {
				Row: {
					group_id: string;
					user_id: string;
				};
				Insert: {
					group_id: string;
					user_id: string;
				};
				Update: {
					group_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_group_group_id_fkey';
						columns: ['group_id'];
						isOneToOne: false;
						referencedRelation: 'group';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'user_group_user_id_fkey1';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			delete_user: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			is_shared_with: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
		};
		Enums: {
			assignment_status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
			permission: 'owner' | 'read' | 'write';
			user_type: 'student' | 'teacher' | 'admin' | 'tester';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;
