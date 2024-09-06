import { parseAsync, renderAsync, renderDocument, WordDocument } from "docx-preview";

class WordDocumentHolder {
    private document: WordDocument | null;

    constructor() {
        this.document = null;
    }

    getParagraphs(): string[] {
        if (this.document) {
            for (const paragraphChild of this.document.documentPart.body.children ) {
                if (paragraphChild.type === "paragraph") {
                    
                }
            }
        }
        return [];
    }

    getDocument(): Document | null {
        return this.document;
    }

}

export default WordDocumentHolder;