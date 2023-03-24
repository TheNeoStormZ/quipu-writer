package com.tns.quipu;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
	
	@CrossOrigin(origins = "*", allowedHeaders = "Accept-Encoding")
	@RequestMapping(value = "/")
	public String index() {
		return "index";
	}

}
