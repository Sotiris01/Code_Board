# ΑΣΚΗΣΗ: Μέσος Όρος Λίστας - ΛΥΣΗ

def mean(L):
    total = 0
    for x in L:
        total = total + x
    return total / len(L)

def median(L):
    # Ταξινόμηση (bubble sort σε αντίγραφο)
    sorted_L = []
    for x in L:
        sorted_L.append(x)

    n = len(sorted_L)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if sorted_L[j] > sorted_L[j + 1]:
                temp = sorted_L[j]
                sorted_L[j] = sorted_L[j + 1]
                sorted_L[j + 1] = temp

    # Διάμεσος
    mid = n // 2
    if n % 2 == 1:
        return sorted_L[mid]
    else:
        return (sorted_L[mid - 1] + sorted_L[mid]) / 2

# Δοκιμές
L1 = [4, 8, 15, 16, 23, 42]
L2 = [10, 20, 30, 40, 50]

print("MO L1:", mean(L1))
print("MO L2:", mean(L2))
print("Διάμεσος L1:", median(L1))
print("Διάμεσος L2:", median(L2))
