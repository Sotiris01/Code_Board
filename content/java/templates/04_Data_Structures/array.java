// Array Operations

public class Array {
    public static void main(String[] args) {
        // Declare and initialize array
        int[] numbers = {1, 2, 3, 4, 5};
        int size = numbers.length;
        
        // Access elements
        System.out.println("First: " + numbers[0]);
        System.out.println("Last: " + numbers[size - 1]);
        
        // Modify element
        numbers[2] = 10;
        
        // Print all elements
        System.out.print("Array: ");
        for (int i = 0; i < size; i++) {
            System.out.print(numbers[i] + " ");
        }
        System.out.println();
        
        // Calculate sum
        int sum = 0;
        for (int i = 0; i < size; i++) {
            sum += numbers[i];
        }
        System.out.println("Sum: " + sum);
    }
}
