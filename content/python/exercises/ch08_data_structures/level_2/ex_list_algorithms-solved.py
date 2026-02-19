# ΑΣΚΗΣΗ: Αντιστροφή Λίστας & Μέγιστο - ΛΥΣΗ

def my_reverse(L):
    result = []
    for i in range(len(L) - 1, -1, -1):
        result.append(L[i])
    return result

def my_max(L):
    maximum = L[0]
    for number in L:
        if number > maximum:
            maximum = number
    return maximum

def my_average(L):
    total = 0.0
    for number in L:
        total += number
    return total / len(L)

L = [45, 12, 78, 34, 90, 23]
print("Αντίστροφη:", my_reverse(L))
print("Μέγιστο:", my_max(L))
print("MO:", my_average(L))
print("Αρχική:", L)
