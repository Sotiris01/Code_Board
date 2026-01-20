# Bubble Sort

def bubble_sort(lst):
    """Sort list using bubble sort algorithm."""
    n = len(lst)
    for i in range(n):
        for j in range(0, n - i - 1):
            if lst[j] > lst[j + 1]:
                lst[j], lst[j + 1] = lst[j + 1], lst[j]
    return lst

# Test
numbers = [64, 34, 25, 12, 22, 11, 90]
print(f"Original: {numbers}")
print(f"Sorted: {bubble_sort(numbers.copy())}")
