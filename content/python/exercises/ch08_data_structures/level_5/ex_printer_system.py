# ΑΣΚΗΣΗ: Σύστημα Εκτυπωτή (Stack + Queue)
#
# Προσομοίωσε ένα σύστημα εκτυπωτή:
# - Οι εργασίες μπαίνουν σε ΟΥΡΑ (FIFO)
# - Αν ακυρωθεί, πάει σε ΣΤΟΙΒΑ αναίρεσης
# - Η αναίρεση (undo) επαναφέρει εργασίες
#
# 1. Ορίσε ΟΛΑ τα functions:
#    Stack: createStack, push, popStack, isEmptyStack
#    Queue: createQueue, enqueue, dequeue, isEmptyQueue
#
# 2. Δοκίμασε:
#    - Πρόσθεσε 5 εργασίες στην ουρά:
#      "Doc1", "Photo", "Report", "CV", "Letter"
#    - Εκτύπωσε 2 (dequeue)
#    - Ακύρωσε 1 (dequeue → push στη στοίβα)
#    - Κάνε undo (pop → enqueue ξανά)
#    - Εκτύπωσε τα υπόλοιπα
#
# 3. Τύπωσε κάθε βήμα

# Γράψε τον κώδικά σου εδώ

