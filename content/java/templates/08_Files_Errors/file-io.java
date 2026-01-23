// File Input/Output

import java.io.*;

public class FileIO {
    public static void main(String[] args) {
        // Write to file
        try (PrintWriter outFile = new PrintWriter("output.txt")) {
            outFile.println("Hello, World!");
            outFile.println("This is a test.");
        } catch (IOException e) {
            System.out.println("Error writing file: " + e.getMessage());
        }
        
        // Read from file
        try (BufferedReader inFile = new BufferedReader(new FileReader("output.txt"))) {
            String line;
            System.out.println("File contents:");
            while ((line = inFile.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
        }
    }
}
