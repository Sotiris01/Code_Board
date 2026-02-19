# ΑΣΚΗΣΗ: Τελεστικό Στατιστικό Αρχείου - ΛΥΣΗ

# Συναρτήσεις
def read_numbers(filename):
    f = open(filename, "r")
    lista = []
    for line in f:
        lista.append(int(line.strip()))
    f.close()
    return lista

def find_max(numbers):
    m = numbers[0]
    for i in range(1, len(numbers)):
        if numbers[i] > m:
            m = numbers[i]
    return m

def find_min(numbers):
    m = numbers[0]
    for i in range(1, len(numbers)):
        if numbers[i] < m:
            m = numbers[i]
    return m

def find_avg(numbers):
    s = 0
    for n in numbers:
        s = s + n
    return s / len(numbers)

def count_above(numbers, limit):
    c = 0
    for n in numbers:
        if n > limit:
            c = c + 1
    return c

# 1. Δημιουργία δεδομένων
f = open("data.txt", "w")
data = [45, 78, 12, 90, 34, 67, 23, 89, 56, 11]
for d in data:
    f.write(str(d) + "\n")
f.close()

# 3. Κλήση συναρτήσεων
nums = read_numbers("data.txt")
megisto = find_max(nums)
elaxisto = find_min(nums)
mesos = find_avg(nums)
pano50 = count_above(nums, 50)

# 4. Εγγραφή αναφοράς
out = open("report.txt", "w")
out.write("=== Στατιστική Αναφορά ===\n")
out.write("Πλήθος: " + str(len(nums)) + "\n")
out.write("Μέγιστο: " + str(megisto) + "\n")
out.write("Ελάχιστο: " + str(elaxisto) + "\n")
out.write("Μέσος Όρος: " + str(round(mesos, 1)) + "\n")
out.write("Πάνω από 50: " + str(pano50) + "\n")
out.close()

# 5. Εμφάνιση
f = open("report.txt", "r")
print(f.read())
f.close()
