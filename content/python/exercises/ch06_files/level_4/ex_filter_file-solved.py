# ΑΣΚΗΣΗ: Φίλτρο Αρχείου - ΛΥΣΗ

# 1. Δημιουργία αρχείου
f = open("all_numbers.txt", "w")
numbers = [12, -5, 8, 0, -3, 15, 7, -1, 20, -8]
for n in numbers:
    f.write(str(n) + "\n")
f.close()

# 2. Ανάγνωση + φιλτράρισμα
inputFile = open("all_numbers.txt", "r")
posFile = open("positive.txt", "w")
negFile = open("negative.txt", "w")

thetikoi = 0
arnitikoi = 0
midenika = 0

for line in inputFile:
    ar = int(line.strip())
    if ar > 0:
        posFile.write(str(ar) + "\n")
        thetikoi = thetikoi + 1
    elif ar < 0:
        negFile.write(str(ar) + "\n")
        arnitikoi = arnitikoi + 1
    else:
        midenika = midenika + 1

inputFile.close()
posFile.close()
negFile.close()

# 3. Αποτελέσματα
print("Θετικοί:", thetikoi)
print("Αρνητικοί:", arnitikoi)
print("Μηδενικά:", midenika)

print("\npositive.txt:")
f = open("positive.txt", "r")
print(f.read())
f.close()

print("negative.txt:")
f = open("negative.txt", "r")
print(f.read())
f.close()
