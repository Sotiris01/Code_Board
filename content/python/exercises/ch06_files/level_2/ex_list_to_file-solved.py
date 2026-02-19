# ΑΣΚΗΣΗ: Εγγραφή Λίστας + Ανάγνωση - ΛΥΣΗ

# 1. Δημιουργία λίστας τετραγώνων
squares = []
for i in range(1, 11):
    squares.append(i * i)
print("Λίστα:", squares)

# 2. Εγγραφή σε αρχείο
f = open("squares.txt", "w")
for item in squares:
    f.write(str(item) + "\n")
f.close()

# 3. Ανάγνωση
f = open("squares.txt", "r")
print("Περιεχόμενο αρχείου:")
print(f.read())
f.close()
