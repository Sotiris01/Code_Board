# ΑΣΚΗΣΗ: Παλίνδρομο - ΛΥΣΗ

def is_palindrome(word):
    # Φτιάξε αντίστροφο string
    reversed_word = ""
    for i in range(len(word) - 1, -1, -1):
        reversed_word += word[i]
    # Σύγκριση
    return word == reversed_word

print(is_palindrome("madam"))
print(is_palindrome("racecar"))
print(is_palindrome("hello"))
print(is_palindrome("a"))
print(is_palindrome("ab"))
