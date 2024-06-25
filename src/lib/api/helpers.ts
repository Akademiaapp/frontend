import { goto } from "$app/navigation";
import { documents } from "@/supabase/supabaseClient";


export async function newDocument(name: string = "Uden titel", isNote: boolean, open: boolean = false) {
    const document = await documents.insert({
        name: name,
        isNote: isNote
    });
    if (open) {
        openFile(document.id, isNote ? "note" : "document");
    }
}

export function newAssignment() {
    // goto('/workspace/editor?page?id=0&type=assignmentAnswers'); TODO
    throw new Error("Not implemented");
}

export function openFile(id: string, type: string) {
    goto(`/workspace/editor?page?id=${id}&type=${type}`); // TODO: Fix this
}

export function getDocumentMembers(documentId: string) {
    // TODO
    throw new Error("Not implemented" + documentId);
}