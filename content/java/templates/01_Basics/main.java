/**
 * Main Class Template
 * Entry point for Java application
 */
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Create scanner for user input
        Scanner scanner = new Scanner(System.in);
        
        // Welcome message
        System.out.println("Welcome to the Java program!");
        
        // Read user input
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        
        // Display greeting
        System.out.println("Hello, " + name + "!");
        
        // Close scanner
        scanner.close();
    }
}
