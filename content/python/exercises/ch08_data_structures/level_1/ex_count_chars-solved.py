# ΑΣΚΗΣΗ: Μέτρηση Κεφαλαίων & Πεζών - ΛΥΣΗ

def analyze(text):
    upper = 0
    lower = 0
    spaces = 0
    for char in text:
        if char.isupper():
            upper += 1
        elif char.islower():
            lower += 1
        elif char == " ":
            spaces += 1
    print("Κείμενο:", text)
    print("Κεφαλαία:", upper)
    print("Πεζά:", lower)
    print("Κενά:", spaces)

analyze("Hello World Python")
print()
analyze("ABCDEFG")
print()
analyze("abcdefg")
