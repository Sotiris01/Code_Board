# ΑΣΚΗΣΗ: Στοίβα — Αντιστροφή Αριθμών - ΛΥΣΗ

def createStack():
    return []

def isEmpty(stack):
    return len(stack) == 0

def push(stack, item):
    stack.append(item)

def pop(stack):
    return stack.pop()

# Εισαγωγή αριθμών
stack = createStack()
number = int(input("Αριθμός (0 τέλος): "))
while number != 0:
    push(stack, number)
    number = int(input("Αριθμός (0 τέλος): "))

# Εμφάνιση σε αντίστροφη σειρά
print("\nΑντίστροφα:")
while not isEmpty(stack):
    print(pop(stack))
