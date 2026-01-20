# Greatest Common Divisor (GCD)

def gcd(a, b):
    """Calculate GCD using Euclidean algorithm."""
    while b:
        a, b = b, a % b
    return a

# Recursive version
def gcd_recursive(a, b):
    """Calculate GCD recursively."""
    if b == 0:
        return a
    return gcd_recursive(b, a % b)

# Test
a, b = 48, 18
print(f"GCD({a}, {b}) = {gcd(a, b)}")

# Using math module
import math
print(f"GCD (math): {math.gcd(a, b)}")
