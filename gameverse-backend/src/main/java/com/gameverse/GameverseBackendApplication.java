package com.gameverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GameverseBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(GameverseBackendApplication.class, args);
	}

}
