# Dictionary Operations

# Create a dictionary
person = {
    "name": "Alice",
    "age": 25,
    "city": "Athens"
}

# Access values
name = person["name"]
age = person.get("age", 0)

# Add/update values
person["email"] = "alice@example.com"
person["age"] = 26

# Loop through dictionary
for key, value in person.items():
    print(f"{key}: {value}")

# Dictionary comprehension
squares = {x: x**2 for x in range(5)}
print(squares)
