# Find Maximum in List

def find_max(numbers):
    """Find the maximum value in a list."""
    if not numbers:
        return None
    
    max_val = numbers[0]
    for num in numbers[1:]:
        if num > max_val:
            max_val = num
    return max_val

# Test
numbers = [3, 7, 2, 9, 1, 5]
print(f"Maximum: {find_max(numbers)}")

# Using built-in
print(f"Maximum (built-in): {max(numbers)}")
