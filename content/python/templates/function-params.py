# Function with Default Parameters

def greet(name, greeting="Hello"):
    """Greet with optional custom greeting."""
    return f"{greeting}, {name}!"

print(greet("Alice"))
print(greet("Bob", "Hi"))
