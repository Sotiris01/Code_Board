# ΑΣΚΗΣΗ: print vs return - ΛΥΣΗ

# ΠΕΡΙΠΤΩΣΗ Α:
def double_print(x):
    print(x * 2)

result = double_print(5)
print("result =", result)
# Γραμμή 1: 10          (η print μέσα στη συνάρτηση)
# Γραμμή 2: result = None (η συνάρτηση ΔΕΝ έχει return
#                           → επιστρέφει None)

print("---")

# ΠΕΡΙΠΤΩΣΗ Β:
def double_return(x):
    return x * 2

result = double_return(5)
print("result =", result)
# Γραμμή 1: result = 10  (η return δίνει τιμή)

print("---")

# ΠΕΡΙΠΤΩΣΗ Γ:
def test(x):
    return x + 1
    print("Τέλος")    # ΝΕΚΡΟΣ ΚΩΔΙΚΑΣ!

print(test(10))
# Γραμμή 1: 11
# Η print("Τέλος") ΔΕΝ εκτελείται!
# Μετά το return η συνάρτηση ΤΕΛΕΙΩΝΕΙ αμέσως.
