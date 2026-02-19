# ΑΣΚΗΣΗ: Modules — import math - ΛΥΣΗ

# Τρόπος 1: import module
import math

print("sqrt(144) =", math.sqrt(144))
print("Εμβαδό κύκλου r=5:", math.pi * math.pow(5, 2))
print("2^10 =", math.pow(2, 10))
print("floor(3.7) =", math.floor(3.7))
print("ceil(3.2) =", math.ceil(3.2))

print()

# Τρόπος 2: from module import ...
from math import sqrt, pi

print("sqrt(2) =", sqrt(2))
print("pi =", pi)

# ΣΗΜΕΙΩΣΗ:
# Τρόπος 1: math.sqrt() → ξεκάθαρο από πού έρχεται
# Τρόπος 2: sqrt() → πιο σύντομο, αλλά μπορεί
#            να μπερδευτεί αν 2 modules έχουν ίδιο όνομα
# Τρόπος 3: from math import * → ΑΠΟΦΕΥΓΕΤΑΙ!
