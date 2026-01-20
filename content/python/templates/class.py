# Class Definition

class Person:
    """A simple Person class."""
    
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, I'm {self.name}!"
    
    def birthday(self):
        self.age += 1
        return f"Happy birthday! Now {self.age} years old."

# Create an instance
person = Person("Alice", 25)
print(person.greet())
print(person.birthday())
