def sqlLite_convertArrayToText(array):
    return '#####'.join(array)

def sqlLite_reverseTextToArray(text):
    return text.split('#####')