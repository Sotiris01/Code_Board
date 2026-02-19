# ΑΣΚΗΣΗ: Διαχωρισμός Θετικών / Αρνητικών - ΛΥΣΗ

def separate(L):
    positives = []
    negatives = []
    zeros = []
    for number in L:
        if number > 0:
            positives.append(number)
        elif number < 0:
            negatives.append(number)
        else:
            zeros.append(number)
    return positives, negatives, zeros

numbers = [3, -1, 4, -5, 0, 2, -3, 7]

pos, neg, zer = separate(numbers)
print("Θετικοί:", pos)
print("Αρνητικοί:", neg)
print("Μηδενικά:", zer)
