# ΑΣΚΗΣΗ: Ιχνηλάτηση Insertion Sort - ΛΥΣΗ

# array = [8, 3, 5, 1]
#
# i=1: value = 3
#   j=1: array[0]=8 > 3 → μετακίνηση 8 δεξιά → [_, 8, 5, 1]
#   j=0: STOP (j==0)
#   Η 3 τοποθετείται στη θέση 0 → [3, 8, 5, 1]
#
# i=2: value = 5
#   j=2: array[1]=8 > 5 → μετακίνηση 8 δεξιά → [3, _, 8, 1]
#   j=1: array[0]=3 > 5; ΟΧΙ → STOP
#   Η 5 τοποθετείται στη θέση 1 → [3, 5, 8, 1]
#
# i=3: value = 1
#   j=3: array[2]=8 > 1 → μετακίνηση → [3, 5, _, 8]
#   j=2: array[1]=5 > 1 → μετακίνηση → [3, _, 5, 8]
#   j=1: array[0]=3 > 1 → μετακίνηση → [_, 3, 5, 8]
#   j=0: STOP
#   Η 1 τοποθετείται στη θέση 0 → [1, 3, 5, 8]
#
# Συνολικές μετακινήσεις: 1 + 1 + 3 = 5

# Επαλήθευση:
def insertionSortTrace(array):
    metakiniseis = 0
    for i in range(1, len(array)):
        value = array[i]
        j = i
        while j > 0 and array[j - 1] > value:
            array[j] = array[j - 1]
            j = j - 1
            metakiniseis += 1
        array[j] = value
        print(f"i={i}: value={value} → {array}")
    print(f"Συνολικές μετακινήσεις: {metakiniseis}")

data = [8, 3, 5, 1]
print("Αρχικά:", data)
insertionSortTrace(data)
