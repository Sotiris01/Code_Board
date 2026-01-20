/**
 * Basic Class Structure
 * Demonstrates class with fields, constructor, and methods
 */
public class MyClass {
    // Private fields
    private String name;
    private int value;
    
    // Constructor
    public MyClass(String name, int value) {
        this.name = name;
        this.value = value;
    }
    
    // Default constructor
    public MyClass() {
        this.name = "";
        this.value = 0;
    }
    
    // Getter for name
    public String getName() {
        return this.name;
    }
    
    // Setter for name
    public void setName(String name) {
        this.name = name;
    }
    
    // Getter for value
    public int getValue() {
        return this.value;
    }
    
    // Setter for value
    public void setValue(int value) {
        this.value = value;
    }
    
    // Display method
    public void display() {
        System.out.println("Name: " + this.name);
        System.out.println("Value: " + this.value);
    }
    
    // toString override
    @Override
    public String toString() {
        return "MyClass{name='" + name + "', value=" + value + "}";
    }
}
