/**
 * For Loop Examples
 * Demonstrates different loop structures in Java
 */
public class ForLoopExample {
    public static void main(String[] args) {
        // Basic for loop - counting 1 to 10
        System.out.println("Counting from 1 to 10:");
        for (int i = 1; i <= 10; i++) {
            System.out.print(i + " ");
        }
        System.out.println();
        
        // For loop with array
        int[] numbers = {5, 10, 15, 20, 25};
        System.out.println("\nArray elements:");
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("numbers[" + i + "] = " + numbers[i]);
        }
        
        // Enhanced for loop (for-each)
        System.out.println("\nUsing enhanced for loop:");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        // Nested for loops - multiplication table
        System.out.println("\nMultiplication table (1-5):");
        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= 5; j++) {
                System.out.printf("%4d", i * j);
            }
            System.out.println();
        }
        
        // Sum calculation
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;
        }
        System.out.println("\nSum of 1 to 100: " + sum);
    }
}
