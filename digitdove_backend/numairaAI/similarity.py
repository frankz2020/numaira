import numpy as np
from scipy.spatial.distance import cosine
from dashscope import Generation

def find_relevant_clips(clips, query_embedding, embed_text, threshold=0.7):
    relevant_clips = []
    for clip in clips:
        clip_embedding = embed_text(clip)
        similarity = 1 - cosine(query_embedding, clip_embedding)
        if similarity >= threshold:
            relevant_clips.append((clip, similarity))
    return sorted(relevant_clips, key=lambda x: x[1], reverse=True)

def identify_exact_words(relevant_clips, revenue_number, api_key):
    clips_text = "\n".join([clip for clip, _ in relevant_clips])
    revenue_number = round_last_significant_digit(revenue_number)
    prompt = (
        f"给定以下文字片段 ：\n{clips_text}\n"
        f"请找出并返回所有与 {revenue_number} 相等的数字。注意只能近似最后一位有效数字。例如2745000000只能近似到2.75 billion，不能近似到2.70 billion"
        f"以下是一些判断相等的例子：'24927000000'和'24.93 billion'就可以理解为相等、'5216000000'与'5.22 billion'可以理解为相等、'2703000000'和'2.70 billion'就可以理解成相等。"
        f"以下是一些判断不相等的例子：'2745000000'与'2.70 billion'就不相等、'5,153,000,000'和'5.22 billion'就不相等、'280000000'与'$2.70 billion就不相等；需要返回not found"
        f"正确答案请使用列表格式返回，例如：['24.93 billion']。"
        f"如果没有找到相等的数字，请返回'not found'。"
    )

    messages = [
        {'role': 'system', 'content': '答案应该用列表形式返回，只包含符合条件的数字，不需要其他信息。如果没有符合的数字，返回“not found”。'},
        {'role': 'user', 'content': prompt}
    ]


    response = Generation.call(
        model="qwen2-72b-instruct",
        messages=messages,
        result_format='message',
        api_key=api_key
    )

    exact_words = None
    if response and isinstance(response, dict) and 'output' in response:
        output = response['output']
        if output and isinstance(output, dict) and 'choices' in output:
            for choice in output['choices']:
                if 'message' in choice and 'content' in choice['message']:
                    exact_words = choice['message']['content']
                    break
    # print("我找到了这个词")
    # print(exact_words)
    return exact_words



def round_last_significant_digit(number_str):

    # Convert string to integer
    number = int(number_str)
    
    # Determine the magnitude and unit
    if number >= 1_000_000_000:
        magnitude = 1_000_000_000
        unit = 'billion'
    elif number >= 1_000_000:
        magnitude = 1_000_000
        unit = 'million'
    elif number >= 1_000:
        magnitude = 1_000
        unit = 'thousand'
    else:
        return number_str  # If the number is less than 1000, return it as is
    
    # Round the number to the nearest magnitude
    rounded_number = round(number / magnitude, 2)
    
    return f"{rounded_number} {unit}"
