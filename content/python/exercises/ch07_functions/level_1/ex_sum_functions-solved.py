# ΑΣΚΗΣΗ: Συνάρτηση Αθροίσματος - ΛΥΣΗ

def my_sum(a, b):
    return a + b

def my_sum3(a, b, c):
    return my_sum(my_sum(a, b), c)

print(my_sum(10, 20))
print(my_sum3(10, 20, 30))
