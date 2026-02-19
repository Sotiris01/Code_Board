# ΑΣΚΗΣΗ: Εμβέλεια — global keyword
#
# ΣΕΝΑΡΙΟ 1 (ΧΩΡΙΣ global):
# myGlobal = 5
# def func1():
#     myGlobal = 42
# def func2():
#     print(myGlobal)
#
# func1()
# func2()
#
# Τι τυπώνεται;
# ΑΠΑΝΤΗΣΗ 1:
#
# ΣΕΝΑΡΙΟ 2 (ΜΕ global):
# myGlobal = 5
# def func1():
#     global myGlobal
#     myGlobal = 42
# def func2():
#     print(myGlobal)
#
# func1()
# func2()
#
# Τι τυπώνεται;
# ΑΠΑΝΤΗΣΗ 2:
#
# ΕΡΩΤΗΣΗ: Ποια είναι η διαφορά;
# Γιατί στο Σενάριο 1 δεν αλλάζει η τιμή;

# Γράψε τον κώδικά σου εδώ

