# ΑΣΚΗΣΗ: Γινόμενο Λίστας (product) - ΛΥΣΗ

def product(L):
    result = 1
    for x in L:
        result = result * x
    return result

print(product([4, 5, 5]))
print(product([1, 2, 3, 4]))
print(product([10]))
print(product([3, 0, 5]))

# ΑΠΑΝΤΗΣΗ: product([3, 0, 5]) → 0
# Αν η λίστα περιέχει 0,
# το γινόμενο γίνεται πάντα 0!
#
# ΣΗΜΕΙΩΣΗ: Ξεκινάμε με result = 1
# γιατί το 1 είναι το ουδέτερο στοιχείο
# του πολλαπλασιασμού (όπως 0 για πρόσθεση)
