# ΑΣΚΗΣΗ: Ουρά (Queue) — Υλοποίηση - ΛΥΣΗ

def createQueue():
    return []

def isEmpty(queue):
    return len(queue) == 0

def enqueue(queue, item):
    queue.append(item)        # εισαγωγή ΠΙΣΩ

def dequeue(queue):
    return queue.pop(0)       # εξαγωγή ΜΠΡΟΣΤΑ

# Δοκιμή
q = createQueue()
enqueue(q, "A")
enqueue(q, "B")
enqueue(q, "C")
print("Ουρά:", q)

print(dequeue(q))         # → A (πρώτο!)
print(dequeue(q))         # → B
print(dequeue(q))         # → C
print(isEmpty(q))         # → True

# ΤΡΟΠΟΣ ΛΕΙΤΟΥΡΓΙΑΣ:
# enqueue A: [A]
# enqueue B: [A, B]
# enqueue C: [A, B, C]
# dequeue:   [B, C]       → A (πρώτο!)
# dequeue:   [C]           → B
# dequeue:   []             → C
