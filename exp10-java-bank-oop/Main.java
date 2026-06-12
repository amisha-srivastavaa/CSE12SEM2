public class Main {
    public static void main(String[] args) {
        System.out.println("=== Experiment 10: Java OOP Principles ===");
        
        System.out.println("\n--- Testing Savings Account ---");
        // Creating object of SavingsAccount
        BankAccount savings = new SavingsAccount("SA-1001", "Amisha Srivastava", 5000.0, 4.5);
        savings.displayDetails();
        savings.deposit(1000);
        savings.calculateInterest(); // Triggers SavingsAccount implementation
        savings.displayDetails();

        System.out.println("\n--- Testing Current Account ---");
        // Creating object of CurrentAccount
        BankAccount current = new CurrentAccount("CA-9002", "Tech Corp", 10000.0, 50.0);
        current.displayDetails();
        current.deposit(2000);
        current.calculateInterest(); // Triggers CurrentAccount implementation
        current.displayDetails();
    }
}
