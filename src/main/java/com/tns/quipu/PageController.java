package com.tns.quipu;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageController {

	@CrossOrigin(origins = "*", allowedHeaders = "Accept-Encoding")
    @RequestMapping(value = "/login")
	public String login() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return "index";
        }
		return "redirect:/";
	}
	@CrossOrigin(origins = "*", allowedHeaders = "Accept-Encoding")
	@RequestMapping(value = "/register")
	public String register() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return "index";
        }
		return "redirect:/";
	}
	@CrossOrigin(origins = "*", allowedHeaders = "Accept-Encoding")
	@RequestMapping(value = "/personajes")
	public String paginaPersonajes() {
            return "index";

	}
	@CrossOrigin(origins = "*", allowedHeaders = "Accept-Encoding")
    @RequestMapping(value = "/personajes/new")
	public String paginaPersonajeNuevo() {
            return "index";

	}
	@CrossOrigin(origins = "*", allowedHeaders = "Accept-Encoding")
	@RequestMapping(value = "/personaje/info")
	public String paginaPersonajeInfo() {
		return "redirect:/personajes";

	}
	@CrossOrigin(origins = "*", allowedHeaders = "Accept-Encoding")
	@RequestMapping(value = "/personaje/update")
	public String paginaPersonajeUpdate() {
		return "redirect:/personajes";

	}
	@CrossOrigin(origins = "*", allowedHeaders = "Accept-Encoding")
	@RequestMapping(value = "/historias/new")
	public String paginaHistoriaNew() {
		return "index";

	}
	@CrossOrigin(origins = "*", allowedHeaders = "Accept-Encoding")
	@RequestMapping(value = "/historia/info")
	public String paginaHistoriaInfo() {
		return "redirect:/";

	}

	@CrossOrigin(origins = "*", allowedHeaders = "Accept-Encoding")
	@RequestMapping(value = "/usuario/info")
	public String paginaUsuarioInfo() {
            return "index";

	}
}
