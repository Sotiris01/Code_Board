# ΑΣΚΗΣΗ: Εμβέλεια — Σύνθετο Σενάριο - ΛΥΣΗ

counter = 0

def add_to_list(L, item):
    global counter
    L.append(item)        # τροποποιεί ΤΗΝ ΙΔΙΑ λίστα
    counter = counter + 1 # αλλάζει GLOBAL (λόγω global)
    print("Πρόσθεσα:", item)

def show(L):
    print("Λίστα:", L)
    print("Πλήθος:", counter)

data = []
add_to_list(data, "Α")
add_to_list(data, "Β")
add_to_list(data, "Γ")
show(data)

# ΑΠΑΝΤΗΣΗ:
# Γραμμή 1: Πρόσθεσα: Α
# Γραμμή 2: Πρόσθεσα: Β
# Γραμμή 3: Πρόσθεσα: Γ
# Γραμμή 4: Λίστα: ['Α', 'Β', 'Γ']
# Γραμμή 5: Πλήθος: 3
#
# ΑΠΑΝΤΗΣΗ ΕΡΩΤΗΣΗΣ:
# - counter χρειάζεται global γιατί ΕΚΧΩΡΟΥΜΕ
#   νέα τιμή (counter = counter + 1)
# - L ΔΕΝ χρειάζεται global γιατί το ΤΡΟΠΟΠΟΙΟΥΜΕ
#   (L.append) — δεν εκχωρούμε νέα τιμή!
# ΚΑΝΟΝΑΣ: append/insert = τροποποίηση (OK χωρίς global)
#           = (εκχώρηση) → χρειάζεται global
