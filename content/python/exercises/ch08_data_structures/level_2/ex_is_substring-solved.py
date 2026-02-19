# ΑΣΚΗΣΗ: isSubstring — Αναζήτηση σε String - ΛΥΣΗ

def isSubstring(text, sub):
    for i in range(len(text) - len(sub) + 1):
        if text[i:i + len(sub)] == sub:
            return True
    return False

print(isSubstring("Hello World", "World"))
print(isSubstring("Hello World", "world"))
print(isSubstring("abcdef", "cde"))
print(isSubstring("abc", "abcd"))
