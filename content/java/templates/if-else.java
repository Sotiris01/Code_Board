/**
 * If-Else Control Flow
 * Demonstrates conditional statements in Java
 */
import java.util.Scanner;

public class IfElseExample {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Read a number from user
        System.out.print("Enter a number: ");
        int number = scanner.nextInt();
        
        // Simple if-else
        if (number > 0) {
            System.out.println("The number is positive");
        } else if (number < 0) {
            System.out.println("The number is negative");
        } else {
            System.out.println("The number is zero");
        }
        
        // Check if even or odd
        if (number % 2 == 0) {
            System.out.println("The number is even");
        } else {
            System.out.println("The number is odd");
        }
        
        // Nested if example
        if (number >= 0) {
            if (number <= 100) {
                System.out.println("Number is between 0 and 100");
            } else {
                System.out.println("Number is greater than 100");
            }
        }
        
        scanner.close();
    }
}
