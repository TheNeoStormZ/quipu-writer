package com.tns.quipu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

import com.tns.quipu.Personaje.Personaje;
import com.tns.quipu.Personaje.PersonajeRepository;
import com.tns.quipu.Security.SecurityConfiguration;

@SpringBootApplication
@Import({ SecurityConfiguration.class})
public class QuipuApplication implements CommandLineRunner {

	@Autowired
	private PersonajeRepository ps;

	public static void main(String[] args) {
		SpringApplication.run(QuipuApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		/*ps.deleteAll();

		ps.save(new Personaje("Sherlock", "Holmes"));
		ps.save(new Personaje("John", "Watson"));*/

		System.out.println("Program launch successful");
	}

}
