# ΑΣΚΗΣΗ: Σάρωση String — Χαρακτήρα-Χαρακτήρα - ΛΥΣΗ

word = "PYTHON"

# 1. Κάθε χαρακτήρας σε ξεχωριστή γραμμή
print("=== Σάρωση ===")
for char in word:
    print(char)

print()

# 2. Με θέση (index)
print("=== Με index ===")
for i in range(len(word)):
    print(str(i) + ": " + word[i])

print()

# 3. Αντίστροφα
print("=== Αντίστροφα ===")
for i in range(len(word) - 1, -1, -1):
    print(word[i])
