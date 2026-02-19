# ΑΣΚΗΣΗ: Μέτρηση Γραμμών - ΛΥΣΗ

def linecount(filename):
    count = 0
    f = open(filename, "r")
    for line in f:
        count = count + 1
    f.close()
    return count

# Δημιουργία αρχείου δοκιμής
f = open("test.txt", "w")
f.write("Γραμμή 1\n")
f.write("Γραμμή 2\n")
f.write("Γραμμή 3\n")
f.write("Γραμμή 4\n")
f.write("Γραμμή 5\n")
f.close()

# Χρήση
result = linecount("test.txt")
print("Γραμμές:", result)   # → 5
