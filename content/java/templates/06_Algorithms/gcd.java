// Greatest Common Divisor (GCD)

public class GCD {
    // Euclidean algorithm
    public static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    // Recursive version
    public static int gcdRecursive(int a, int b) {
        if (b == 0) return a;
        return gcdRecursive(b, a % b);
    }
    
    public static void main(String[] args) {
        int a = 48, b = 18;
        
        System.out.println("GCD(" + a + ", " + b + ") = " + gcd(a, b));
        System.out.println("GCD (recursive) = " + gcdRecursive(a, b));
    }
}
