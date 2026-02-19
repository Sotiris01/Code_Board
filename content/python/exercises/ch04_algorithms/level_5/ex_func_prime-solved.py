# ΑΣΚΗΣΗ: Συνάρτηση is_protos - ΛΥΣΗ

def is_protos(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

# Κύριο πρόγραμμα
for ar in range(2, 51):
    if is_protos(ar):
        print(ar, end=" ")
