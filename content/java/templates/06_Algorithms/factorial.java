// Factorial Calculation

public class Factorial {
    // Recursive version
    public static long factorial(int n) {
        if (n < 0) return -1;
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
    
    // Iterative version
    public static long factorialIter(int n) {
        if (n < 0) return -1;
        long result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    public static void main(String[] args) {
        int n = 5;
        
        System.out.println(n + "! = " + factorial(n));
        System.out.println(n + "! = " + factorialIter(n) + " (iterative)");
    }
}
