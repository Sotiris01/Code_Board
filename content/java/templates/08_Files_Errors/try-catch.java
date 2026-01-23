// Try-Catch Exception Handling

public class TryCatch {
    public static double divide(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Division by zero!");
        }
        return a / b;
    }
    
    public static void main(String[] args) {
        try {
            double result = divide(10, 2);
            System.out.println("Result: " + result);
            
            result = divide(10, 0);  // This will throw
            System.out.println("Result: " + result);
        }
        catch (ArithmeticException e) {
            System.out.println("Error: " + e.getMessage());
        }
        catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
        }
        
        System.out.println("Program continues...");
    }
}
