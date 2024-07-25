from numairaAI.extract import extract_text_from_word
from numairaAI.split import split_text_into_clips
from numairaAI.embedding import embed_text
from numairaAI.store import store_clips_to_file
from numairaAI.similarity import find_relevant_clips, identify_exact_words
from numairaAI.format_mapping import format_maps, parse_nested_list
import os

# Qwen API key
api_key = os.getenv("API_KEY")


# return a list of lists with the old value and the new value
def numberMappingFromExcelToWord(word_value, old_excel_value, new_excel_value):

    # File paths

    clips_file = "clips.txt"

    # extracted_text = extract_text_from_word(word_value)
    extracted_text = word_value
    clips = split_text_into_clips(extracted_text)
    store_clips_to_file(clips, clips_file)

    query_embedding = embed_text(old_excel_value)

    relevant_clips = find_relevant_clips(clips, query_embedding, embed_text)

    exact_words = identify_exact_words(relevant_clips, old_excel_value, api_key)

    # print("Relevant clips found in the Word file:")
    # for clip, similarity in relevant_clips:
    #     print(f"Clip: {clip}\nSimilarity: {similarity}\n")

    # print("revenue_number:"+revenue_number)
    # print("Exact words related to the revenue number:")
    # print(exact_words)
    # print(type(exact_words))

    exact_words_list = parse_nested_list(exact_words)
    task = []
    for i in exact_words_list:
        temp = []
        i = i.strip()
        temp.append(i[1:-1])
        new_value = format_maps(old_excel_value, i[1:-1], new_excel_value).strip().replace("'", "")
        print(new_value)
        temp.append(new_value)
        task.append(temp)
    return task


# word_value = 'old.docx'
# old_excel_value = " 10,811,255"
# new_excel_value = " 10,911,255"

# numberMappingFromExcelToWord(word_value, old_excel_value, new_excel_value)
