import { goto } from "$app/navigation";
import type { Tables } from "@/supabase.types";
import { documents } from "@/supabase/supabaseClient";


export async function newDocument(name: string = "Uden titel", is_note: boolean, open: boolean = false) {
    const document = await documents.insert({
        name: name,
        is_note: is_note
    });
    if (open) {
        openFile(document.id, is_note ? "note" : "document");
    }
}

export function newAssignment() {
    // goto('/workspace/editor?page?id=0&type=assignmentAnswers'); TODO
    throw new Error("Not implemented");
}

export function openFile(id: string, type: string) {
    goto(`/workspace/editor?page?id=${id}&type=${type}`); // TODO: Fix this
}

export function getDocumentMembers(documentId: string): Tables<'user'>[] {
    // TODO
    throw new Error("Not implemented" + documentId);
}

export function getFileType(file: Tables<'document' | 'assignment' | 'assignment_answer'>) {
    if ('due_date' in file) {
        return 'assignment';
    } else if ('feedback_id' in file) {
        return 'assignment_answer';
    } else if ('is_note' in file) {
        if (file.is_note) {
            return 'note';
        } else {
            return 'document';
        }
    }
}

export function inviteUserToDocument(username: string, document_id: string) {
    // TODO
    throw new Error("Not implemented" + username + document_id);
}