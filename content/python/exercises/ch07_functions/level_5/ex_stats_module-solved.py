# ΑΣΚΗΣΗ: Μίνι Module — Στατιστική - ΛΥΣΗ

def my_sum(L):
    s = 0
    for x in L:
        s = s + x
    return s

def my_mean(L):
    return my_sum(L) / len(L)

def my_max(L):
    m = L[0]
    for x in L:
        if x > m:
            m = x
    return m

def my_min(L):
    m = L[0]
    for x in L:
        if x < m:
            m = x
    return m

def my_range(L):
    return my_max(L) - my_min(L)

def count_above(L, limit):
    c = 0
    for x in L:
        if x > limit:
            c = c + 1
    return c

def count_below(L, limit):
    c = 0
    for x in L:
        if x < limit:
            c = c + 1
    return c

def histogram(L):
    for x in L:
        print(str(x) + ": " + "*" * x)

# Δοκιμές
data = [45, 78, 12, 90, 34, 67, 23, 89]

print("Άθροισμα:", my_sum(data))
print("MO:", round(my_mean(data), 1))
print("Max:", my_max(data))
print("Min:", my_min(data))
print("Εύρος:", my_range(data))
print("Πάνω από 50:", count_above(data, 50))
print("Κάτω από 30:", count_below(data, 30))

print()
print("Ιστόγραμμα:")
histogram([3, 1, 4, 2, 5])
