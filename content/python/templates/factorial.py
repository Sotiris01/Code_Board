# Factorial Calculation

def factorial(n):
    """Calculate factorial of n."""
    if n < 0:
        return None
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Iterative version
def factorial_iter(n):
    """Calculate factorial iteratively."""
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

# Test
n = 5
print(f"{n}! = {factorial(n)}")
print(f"{n}! = {factorial_iter(n)}")
