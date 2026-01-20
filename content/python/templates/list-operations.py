# List Operations

# Create a list
numbers = [1, 2, 3, 4, 5]

# Add elements
numbers.append(6)
numbers.insert(0, 0)

# Remove elements
numbers.remove(3)
last = numbers.pop()

# Access elements
first = numbers[0]
slice = numbers[1:4]

# List comprehension
squares = [x**2 for x in numbers]

print(f"Numbers: {numbers}")
print(f"Squares: {squares}")
