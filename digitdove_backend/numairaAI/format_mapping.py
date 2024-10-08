from dashscope import Generation
import os
import ast

api_key = os.getenv("API_KEY")

def format_maps(old_excel_value, old_doc_value, new_excel_value):
    #we assume 
    prompt = (
        f"请根据\n'{old_excel_value}'到'{old_doc_value}'的格式变化逻辑"
        f"给出'{new_excel_value}'根据同样的变换逻辑会生成的字段，注意理解数字单位，要保持表值一样，用给定语言回答，不要翻译。只回答相关的数字，不要回答多余信息"
    )

    messages = [
        {'role': 'system', 'content': '只回答相关的数字，不要包含多余信息'},
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
        if isinstance(output, dict) and 'choices' in output:
            for choice in output['choices']:
                if 'message' in choice and 'content' in choice['message']:
                    exact_words = choice['message']['content']
                    break
    return exact_words
def parse_nested_list(s):
    if not s:
        return []
    s = s[1:-1]
    
    result = []
    temp = ""
    nested_level = 0
    inside_quotes = False
    
    for char in s:
        if char == '[':
            if nested_level > 0 or inside_quotes:
                temp += char
            nested_level += 1
        elif char == ']':
            nested_level -= 1
            if nested_level == 0:
                result.append(temp.strip())
                temp = ""
            else:
                temp += char
        elif char == ',' and nested_level == 0:
            if temp.strip():
                result.append(temp.strip())
                temp = ""
        else:
            temp += char
    
    if temp.strip():
        result.append(temp.strip())
    
    return result

