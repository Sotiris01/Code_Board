# ΑΣΚΗΣΗ: Αφαίρεση Κενών (trimSpaces) - ΛΥΣΗ

def trimSpaces(sentence):
    result = ""
    for char in sentence:
        if char != " ":
            result += char
    return result

print(trimSpaces("Hello World"))
print(trimSpaces("Γειά σου κόσμε"))
print(trimSpaces("  a  b  c  "))
