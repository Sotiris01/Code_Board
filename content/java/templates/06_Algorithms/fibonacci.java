// Fibonacci Sequence

import java.util.ArrayList;

public class Fibonacci {
    // Iterative version
    public static ArrayList<Integer> fibonacci(int n) {
        ArrayList<Integer> fib = new ArrayList<>();
        if (n <= 0) return fib;
        
        fib.add(0);
        if (n == 1) return fib;
        
        fib.add(1);
        for (int i = 2; i < n; i++) {
            fib.add(fib.get(i-1) + fib.get(i-2));
        }
        return fib;
    }
    
    // Recursive version
    public static int fibRecursive(int n) {
        if (n <= 1) return n;
        return fibRecursive(n-1) + fibRecursive(n-2);
    }
    
    public static void main(String[] args) {
        int n = 10;
        
        System.out.print("First " + n + " Fibonacci: ");
        ArrayList<Integer> fib = fibonacci(n);
        for (int num : fib) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        System.out.println("Fib(" + n + "): " + fibRecursive(n));
    }
}
