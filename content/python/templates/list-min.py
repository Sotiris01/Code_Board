# Find Minimum in List

def find_min(numbers):
    """Find the minimum value in a list."""
    if not numbers:
        return None
    
    min_val = numbers[0]
    for num in numbers[1:]:
        if num < min_val:
            min_val = num
    return min_val

# Test
numbers = [3, 7, 2, 9, 1, 5]
print(f"Minimum: {find_min(numbers)}")

# Using built-in
print(f"Minimum (built-in): {min(numbers)}")
