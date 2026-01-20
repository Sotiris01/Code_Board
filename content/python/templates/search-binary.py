# Binary Search (requires sorted list)

def binary_search(lst, target):
    """Binary search for target in sorted list."""
    left, right = 0, len(lst) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if lst[mid] == target:
            return mid
        elif lst[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Test
numbers = [1, 2, 3, 5, 7, 9, 11, 13]
target = 7

index = binary_search(numbers, target)
if index != -1:
    print(f"Found {target} at index {index}")
else:
    print(f"{target} not found")
