import numpy as np
from scipy.spatial.distance import cosine
from dashscope import Generation

def find_relevant_clips(clips, query_embedding, embed_text, threshold=0.6):
    relevant_clips = []
    for clip in clips:
        clip_embedding = embed_text(clip)
        similarity = 1 - cosine(query_embedding, clip_embedding)
        if similarity >= threshold:
            relevant_clips.append((clip, similarity))
    return sorted(relevant_clips, key=lambda x: x[1], reverse=True)

def identify_exact_words(relevant_clips, revenue_number, api_key):
    clips_text = "\n".join([clip for clip, _ in relevant_clips])
    prompt = (
        f"给定以下文字片段：\n{clips_text}\n\n"
        f"请找出其中与 {revenue_number} 近似相等或相等的数字（允许四舍五入的近似），例如5.216和5.22就可以理解为相等；24,927,000,000和24.93 billion就可以理解为相等2,703,000,000和2.70 billion就可以理解成相等。如果没有与{revenue_number} 相等的文字片段，请返回'not found'。"
        f"只需回答相关的数字，并用列表和引号分开，如 ['123456', '123百万']或者['456']。不要回复包含多余的信息。" 
    )

    messages = [
        {'role': 'system', 'content': '只回答相关的数字，用嵌套列表装起来，不要包含多余信息，找不到就返回not found'},
        {'role': 'user', 'content': prompt}
    ]

    response = Generation.call(
        model="qwen-max",
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
