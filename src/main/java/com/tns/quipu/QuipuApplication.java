package com.tns.quipu;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

import com.tns.quipu.Security.SecurityConfiguration;

@SpringBootApplication
@Import({ SecurityConfiguration.class})
public class QuipuApplication implements CommandLineRunner {


	public static void main(String[] args) {
		SpringApplication.run(QuipuApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		System.out.println("Program launch successful");
	}

}
