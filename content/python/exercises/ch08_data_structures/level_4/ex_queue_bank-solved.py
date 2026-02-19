# ΑΣΚΗΣΗ: Εφαρμογή Ουράς — Εξυπηρέτηση - ΛΥΣΗ

def createQueue():
    return []

def isEmpty(queue):
    return len(queue) == 0

def enqueue(queue, item):
    queue.append(item)

def dequeue(queue):
    return queue.pop(0)

# Δημιουργία ουράς
q = createQueue()

# 2. Άφιξη 5 πελατών
enqueue(q, "Νίκος")
enqueue(q, "Μαρία")
enqueue(q, "Γιώργος")
enqueue(q, "Ελένη")
enqueue(q, "Κώστας")
print("Ουρά:", q)

# 3. Εξυπηρέτηση 2 πρώτων
print("\nΕξυπηρετείται:", dequeue(q))
print("Εξυπηρετείται:", dequeue(q))
print("Ουρά:", q)

# 4. Νέοι πελάτες
enqueue(q, "Αθηνά")
enqueue(q, "Δημήτρης")
print("\nΝέα ουρά:", q)

# 5. Εξυπηρέτηση υπολοίπων
print("\nΕξυπηρέτηση υπολοίπων:")
while not isEmpty(q):
    print("Εξυπηρετείται:", dequeue(q))

print("Η ουρά άδειασε!")
