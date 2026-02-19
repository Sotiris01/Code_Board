# ΑΣΚΗΣΗ: Στοίβα vs Ουρά — Σύγκριση - ΛΥΣΗ

# Συναρτήσεις Στοίβας
def createStack():
    return []

def push(stack, item):
    stack.append(item)

def popStack(stack):
    return stack.pop()

def isEmptyStack(stack):
    return len(stack) == 0

# Συναρτήσεις Ουράς
def createQueue():
    return []

def enqueue(queue, item):
    queue.append(item)

def dequeue(queue):
    return queue.pop(0)

def isEmptyQueue(queue):
    return len(queue) == 0

# ΣΕΝΑΡΙΟ Α — ΣΤΟΙΒΑ
s = createStack()
push(s, 10)
push(s, 20)
push(s, 30)
print("Στοίβα:", end=" ")
while not isEmptyStack(s):
    print(popStack(s), end=" ")
print()
# ΑΠΑΝΤΗΣΗ Α: 30 20 10 (ΑΝΤΙΣΤΡΟΦΑ!)

# ΣΕΝΑΡΙΟ Β — ΟΥΡΑ
q = createQueue()
enqueue(q, 10)
enqueue(q, 20)
enqueue(q, 30)
print("Ουρά:  ", end=" ")
while not isEmptyQueue(q):
    print(dequeue(q), end=" ")
print()
# ΑΠΑΝΤΗΣΗ Β: 10 20 30 (ΣΤΗ ΣΕΙΡΑ!)

# ΑΠΑΝΤΗΣΕΙΣ:
# 1. Η ΣΤΟΙΒΑ βγάζει αντίστροφα
# 2. Η ΟΥΡΑ βγάζει στη σειρά εισαγωγής
# 3. LIFO = Last In First Out (Στοίβα)
#    FIFO = First In First Out (Ουρά)
