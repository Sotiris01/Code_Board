# ΑΣΚΗΣΗ: Κεφαλαία / Πεζά - ΛΥΣΗ

# 1. Δημιουργία αρχείου
f = open("message.txt", "w")
f.write("hello world\n")
f.write("python is great\n")
f.write("i love programming\n")
f.close()

# 2. Μετατροπή σε κεφαλαία
inputFile = open("message.txt", "r")
outputFile = open("message_upper.txt", "w")

for line in inputFile:
    outputFile.write(line.upper())

inputFile.close()
outputFile.close()

# 3. Εμφάνιση
f = open("message_upper.txt", "r")
print(f.read())
f.close()
