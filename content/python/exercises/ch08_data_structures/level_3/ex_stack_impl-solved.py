# ΑΣΚΗΣΗ: Στοίβα (Stack) — Υλοποίηση - ΛΥΣΗ

def createStack():
    return []

def isEmpty(stack):
    return len(stack) == 0

def push(stack, item):
    stack.append(item)

def pop(stack):
    return stack.pop()

# Δοκιμή
s = createStack()
push(s, "A")
push(s, "B")
push(s, "C")
print("Στοίβα:", s)

print(pop(s))          # → C (τελευταίο!)
print(pop(s))          # → B
print(isEmpty(s))      # → False
print(pop(s))          # → A
print(isEmpty(s))      # → True

# ΤΡΟΠΟΣ ΛΕΙΤΟΥΡΓΙΑΣ:
# push A: [A]
# push B: [A, B]
# push C: [A, B, C]   ← κορυφή
# pop:    [A, B]       → C
# pop:    [A]          → B
# pop:    []           → A
