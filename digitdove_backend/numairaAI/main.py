from numairaAI.extract import extract_text_from_word
from numairaAI.embedding import embed_text
from numairaAI.store import store_clips_to_file
from numairaAI.similarity import find_relevant_clips, identify_exact_words
from numairaAI.format_mapping import format_maps, parse_nested_list
from numairaAI.en_split import en_split_text_into_clips
# from numairaAI.cn_split import cn_split_text_into_clips
import os

# Qwen API key
api_key = os.getenv("API_KEY")


print("I am called")

# return a list of lists with the old value and the new value
def numberMappingFromExcelToWord(word_value, old_excel_value, new_excel_value):

    if not word_value or not old_excel_value or not new_excel_value:
        # Handle the case where any of the inputs are None or empty
        return []
    if old_excel_value[0] == "-":
        return 
    clips_file = "clips.txt"

    # extracted_text = extract_text_from_word(word_value)
    extracted_text = word_value
    clips = en_split_text_into_clips(extracted_text)
    # clips = cn_split_text_into_clips(extracted_text)  # Chinese version
    store_clips_to_file(clips, clips_file)

    query_embedding = embed_text(old_excel_value)

    relevant_clips = find_relevant_clips(clips, query_embedding, embed_text)

    if not relevant_clips:
        return

    exact_words = identify_exact_words(relevant_clips, old_excel_value, api_key) #if does not exist, it returns ['']

    if exact_words == 'not found':
        # Handle the case where exact_words is None or empty
        return []
    exact_words_list = parse_nested_list(exact_words)
    if not exact_words_list:
        return
    task = []
    for i in exact_words_list:
        temp = []
        i = i.strip()
        temp.append(i[1:-1])
        new_value = format_maps(old_excel_value, i[1:-1], new_excel_value)
        if new_value:  # Ensure new_value is not None
            new_value = new_value.strip().replace("'", "")
            temp.append(new_value)
            task.append(temp) 
    print("what's return")
    print(task)
    return task
