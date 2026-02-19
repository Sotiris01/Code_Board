# ΑΣΚΗΣΗ: Μέτρηση Φωνηέντων - ΛΥΣΗ

def count_vowels(word):
    vowels = "AEIOUaeiou"
    count = 0
    for letter in word:
        if letter in vowels:
            count += 1
    return count

print(count_vowels("Hello"))
print(count_vowels("PYTHON"))
print(count_vowels("aeiou"))
print(count_vowels("bcdfg"))
