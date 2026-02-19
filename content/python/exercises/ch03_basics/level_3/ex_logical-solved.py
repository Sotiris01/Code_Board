# ΑΣΚΗΣΗ: Λογικές Εκφράσεις - ΛΥΣΗ

print(1 == 1 and 0 != 1)            # True  (True and True = True)
print("test" == 'test')             # True  (μονά = διπλά εισαγωγικά)
print(False and 1 != 0)             # False (False and X = False, short-circuit)
print(not (4 == 4 and 1 != 0))      # False (not (True and True) = not True = False)
print(1 == 1 or 2 != 1 or 5 == 5)   # True  (True or X = True, short-circuit)
print(not (5 == 5 or (1 != 0 and 6 != 7)))  # False (not True = False)
