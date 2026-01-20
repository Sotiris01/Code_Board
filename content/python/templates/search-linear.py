# Linear Search

def linear_search(lst, target):
    """Search for target in list, return index or -1."""
    for i, item in enumerate(lst):
        if item == target:
            return i
    return -1

# Test
numbers = [3, 7, 2, 9, 1, 5]
target = 9

index = linear_search(numbers, target)
if index != -1:
    print(f"Found {target} at index {index}")
else:
    print(f"{target} not found")
