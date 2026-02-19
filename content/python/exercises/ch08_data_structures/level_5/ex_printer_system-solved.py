# ΑΣΚΗΣΗ: Σύστημα Εκτυπωτή (Stack + Queue) - ΛΥΣΗ

# Stack functions
def createStack():
    return []

def isEmptyStack(stack):
    return len(stack) == 0

def push(stack, item):
    stack.append(item)

def popStack(stack):
    return stack.pop()

# Queue functions
def createQueue():
    return []

def isEmptyQueue(queue):
    return len(queue) == 0

def enqueue(queue, item):
    queue.append(item)

def dequeue(queue):
    return queue.pop(0)

# Δημιουργία
printer_queue = createQueue()
undo_stack = createStack()

# Προσθήκη εργασιών
for job in ["Doc1", "Photo", "Report", "CV", "Letter"]:
    enqueue(printer_queue, job)
print("Ουρά:", printer_queue)

# Εκτύπωση 2
print("\n--- Εκτύπωση ---")
print("Εκτυπώνεται:", dequeue(printer_queue))
print("Εκτυπώνεται:", dequeue(printer_queue))
print("Ουρά:", printer_queue)

# Ακύρωση 1 → πάει στη στοίβα undo
print("\n--- Ακύρωση ---")
cancelled = dequeue(printer_queue)
print("Ακυρώθηκε:", cancelled)
push(undo_stack, cancelled)
print("Ουρά:", printer_queue)
print("Undo stack:", undo_stack)

# Undo → επαναφορά στην ουρά
print("\n--- Undo ---")
restored = popStack(undo_stack)
enqueue(printer_queue, restored)
print("Επαναφέρθηκε:", restored)
print("Ουρά:", printer_queue)

# Εκτύπωση υπολοίπων
print("\n--- Εκτύπωση υπολοίπων ---")
while not isEmptyQueue(printer_queue):
    print("Εκτυπώνεται:", dequeue(printer_queue))

print("Ολοκληρώθηκε!")
