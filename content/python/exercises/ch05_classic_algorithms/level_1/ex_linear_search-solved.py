# ΑΣΚΗΣΗ: Γραμμική Αναζήτηση - ΛΥΣΗ

numbers = [4, 17, 3, 22, 8, 15, 31, 6]

key = int(input("Δώσε αριθμό: "))

found = False
thesi = -1

for i in range(len(numbers)):
    if numbers[i] == key:
        found = True
        thesi = i

if found:
    print("Βρέθηκε στη θέση", thesi)
else:
    print("Δεν βρέθηκε")
