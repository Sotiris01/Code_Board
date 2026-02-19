# ΑΣΚΗΣΗ: Εμβέλεια — global keyword - ΛΥΣΗ

# ΣΕΝΑΡΙΟ 1 (ΧΩΡΙΣ global):
myGlobal = 5
def func1():
    myGlobal = 42          # ΤΟΠΙΚΗ μεταβλητή!
def func2():
    print(myGlobal)

func1()
func2()
# ΑΠΑΝΤΗΣΗ 1: 5
# Η myGlobal = 42 στη func1 δημιουργεί
# ΤΟΠΙΚΗ μεταβλητή. Η global μένει 5.

print("---")

# ΣΕΝΑΡΙΟ 2 (ΜΕ global):
myGlobal = 5
def func1():
    global myGlobal
    myGlobal = 42          # ΑΛΛΑΖΕΙ την ΚΑΘΟΛΙΚΗ!
def func2():
    print(myGlobal)

func1()
func2()
# ΑΠΑΝΤΗΣΗ 2: 42
# Η δήλωση global myGlobal λέει στην Python
# ότι αναφερόμαστε στην καθολική μεταβλητή,
# ΟΧΙ σε νέα τοπική.

# ΚΑΝΟΝΑΣ:
# Χωρίς global → η εκχώρηση δημιουργεί ΤΟΠΙΚΗ
# Με global    → η εκχώρηση αλλάζει την ΚΑΘΟΛΙΚΗ
