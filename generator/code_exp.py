code_example = """
def linear_search(arr, target):
    # Loop through every index and element in the array
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Return the index immediately upon finding a match

    return -1  # Return -1 if the loop finishes and the target is not found


if __name__ == "__main__":
    numbers = [10, 50, 30, 70, 80, 20, 90, 40]
    search_target = 30

    # Execute the search
    result = linear_search(numbers, search_target)

    # Output the result
    if result != -1:
        print(f"Element found at index: {result}")
    else:
        print("Element not found in the list.")
"""
