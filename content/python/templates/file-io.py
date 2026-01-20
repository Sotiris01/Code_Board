# File Input/Output

# Write to file
with open("output.txt", "w") as f:
    f.write("Hello, World!\n")
    f.write("This is a test.\n")

# Read from file
with open("output.txt", "r") as f:
    content = f.read()
    print(content)

# Read line by line
with open("output.txt", "r") as f:
    for line in f:
        print(line.strip())
