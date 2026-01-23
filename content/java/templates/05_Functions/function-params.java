// Method with Overloading (Java alternative to default params)

public class FunctionParams {
    // Overloaded methods (Java way of default parameters)
    public static String greet(String name) {
        return greet(name, "Hello");
    }
    
    public static String greet(String name, String greeting) {
        return greeting + ", " + name + "!";
    }
    
    public static void main(String[] args) {
        System.out.println(greet("Alice"));
        System.out.println(greet("Bob", "Hi"));
    }
}
