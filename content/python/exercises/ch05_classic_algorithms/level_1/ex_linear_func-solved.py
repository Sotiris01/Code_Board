# ΑΣΚΗΣΗ: Γραμμική Αναζήτηση ως Συνάρτηση - ΛΥΣΗ

def linearSearch(lista, key):
    for i in range(len(lista)):
        if lista[i] == key:
            return i
    return -1

# Κύριο πρόγραμμα
data = [10, 25, 3, 18, 7, 42, 15]

thesi1 = linearSearch(data, 18)
print("Αναζήτηση 18:", thesi1)    # → 3

thesi2 = linearSearch(data, 99)
print("Αναζήτηση 99:", thesi2)    # → -1
