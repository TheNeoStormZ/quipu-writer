package com.tns.quipu;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageController {
    @RequestMapping(value = "/login")
	public String login() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return "index";
        }
		return "redirect:/";
	}

	@RequestMapping(value = "/register")
	public String register() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return "index";
        }
		return "redirect:/";
	}
	
	@RequestMapping(value = "/personajes")
	public String paginaPersonajes() {
            return "index";

	}

    @RequestMapping(value = "/personajes/new")
	public String paginaPersonajeNuevo() {
            return "index";

	}

	@RequestMapping(value = "/personaje/info")
	public String paginaPersonajeInfo() {
		return "redirect:/personajes";

	}

	@RequestMapping(value = "/personaje/update")
	public String paginaPersonajeUpdate() {
		return "redirect:/personajes";

	}
}
