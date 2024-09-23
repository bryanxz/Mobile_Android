import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {

	
	public static void main(String[] args) 
	{
		System.out.println(args[0]);
		BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
		String status = "s";
		while(status.equals("s"))
		{
			try
			{
				System.out.println("Digite uma operação (+, -, x, /, raiz, potencia, %)");
				String operacao = reader.readLine();
				
				double valor1;
				double valor2;
				
				switch (operacao)
				{
					case "+":
						System.out.println("Digite um valor: ");
						 valor1 = Double.parseDouble(reader.readLine());
						
						System.out.println("Digite um valor: ");
						 valor2 = Double.parseDouble(reader.readLine());
						 
						System.out.println("Resultado: "+Somar(valor1, valor2));
						break;
						
					case "-":
						System.out.println("Digite um valor: ");
						 valor1 = Double.parseDouble(reader.readLine());
						
						System.out.println("Digite um valor: ");
						 valor2 = Double.parseDouble(reader.readLine());
						 
						 System.out.println("Resultado: "+Subtrair(valor1, valor2));
						break;
						
					case "x":
						System.out.println("Digite um valor: ");
						 valor1 = Double.parseDouble(reader.readLine());
						
						System.out.println("Digite um valor: ");
						 valor2 = Double.parseDouble(reader.readLine());
						 
						 System.out.println("Resultado: "+Multiplicar(valor1, valor2));
						break;
						
					case "/":
						System.out.println("Digite um valor: ");
						 valor1 = Double.parseDouble(reader.readLine());
						
						System.out.println("Digite um valor: ");
						 valor2 = Double.parseDouble(reader.readLine());
						 
						 System.out.println("Resultado: "+Dividir(valor1, valor2));
						break;
						
					case "raiz":
						System.out.println("Digite um valor: ");
						 valor1 = Double.parseDouble(reader.readLine());
						 
						 System.out.println("Resultado: "+Radiciar(valor1));
						break;
						
					case "potencia":
						System.out.println("Digite um valor: ");
						 valor1 = Double.parseDouble(reader.readLine());
						
						System.out.println("Digite um valor: ");
						 valor2 = Double.parseDouble(reader.readLine());
						 
						 System.out.println("Resultado: "+Potenciar(valor1, valor2));
						break;
						
					case "%":
						System.out.println("Digite um valor: ");
						 valor1 = Double.parseDouble(reader.readLine());
						
						System.out.println("Digite um valor: ");
						 valor2 = Double.parseDouble(reader.readLine());
						 
						 System.out.println("Resultado: "+Potenciar(valor1, valor2)+"%");
						break;

				}
				System.out.println("Continuar?(s/n)");
				status = reader.readLine();
			}
			catch (IOException e)
			{
				
			}
		}
		

	}
	
	public static double Somar(double a, double b)
	{
		return a + b;
	}
	public static double Subtrair(double a, double b)
	{
		return a - b;
	}
	public static double Multiplicar(double a, double b)
	{
		return a * b;
	}
	public static double Dividir(double a, double b)
	{
		return a / b;
	}
	public static double Radiciar(double a)
	{
		return Math.sqrt(a);
	}
	public static double Potenciar(double a, double b)
	{
		return Math.pow(a, b);
	}
	public static double Percentuar(double a, double b)
	{
		return (a * b) / 100;
	}

}
