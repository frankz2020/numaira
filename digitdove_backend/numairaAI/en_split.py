import spacy
import re

# Load the spaCy model for "English" only
nlp = spacy.load("en_core_web_sm")

test = "was $2.70 billion and $5.22 billion, "

def split_sentence(doc):
    chunks = []
    current_chunk = []

    for token in doc:
        # Check if the current token is a number and the next token could be 'million', 'billion', etc.
        if token.like_num and (token.nbor() if token.i + 1 < len(doc) else None):
            next_token = token.nbor()
            if next_token.text.lower() in {"million", "billion", "trillion"}:
                # If condition met, append current token and a space, then continue to add next token
                current_chunk.append(token.text + ' ')
                continue

        # Regular appending of token text to current chunk
        current_chunk.append(token.text)

        # Split at this token if it is followed by a whitespace that's more than just an empty string
        if token.whitespace_:
            chunks.append(''.join(current_chunk))
            current_chunk = []

    # Append any remaining tokens in the current chunk
    if current_chunk:
        chunks.append(''.join(current_chunk))

    return chunks

def en_split_text_into_clips(text):
    # Process the text with spaCy
    doc = nlp(text)
    sentences = split_sentence(doc)
    clips = []

    # Filter clips containing numeric values
    for sentence in sentences:
        sentence = sentence.strip()
        if re.search(r'\d', sentence):
            clips.append(sentence)

    # Remove any empty clips
    clips = [clip.strip() for clip in clips if clip.strip()]
    return clips

print(en_split_text_into_clips(test))
