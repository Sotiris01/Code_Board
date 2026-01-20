# Fibonacci Sequence

def fibonacci(n):
    """Generate first n Fibonacci numbers."""
    if n <= 0:
        return []
    if n == 1:
        return [0]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

# Recursive version
def fib_recursive(n):
    """Get nth Fibonacci number recursively."""
    if n <= 1:
        return n
    return fib_recursive(n-1) + fib_recursive(n-2)

# Test
n = 10
print(f"First {n} Fibonacci: {fibonacci(n)}")
print(f"Fib({n}): {fib_recursive(n)}")
