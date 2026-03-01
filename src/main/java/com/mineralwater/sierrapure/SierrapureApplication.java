package com.mineralwater.sierrapure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SierrapureApplication {
	public static void main(String[] args) {
		SpringApplication.run(SierrapureApplication.class, args);
	}
}

