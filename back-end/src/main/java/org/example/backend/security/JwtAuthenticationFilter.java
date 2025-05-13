package org.example.backend.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Ne pas traiter les requêtes OPTIONS
        if (request.getMethod().equals("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        // Si pas d'en-tête Authorization ou s'il ne commence pas par "Bearer ", passer au filtre suivant
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extraire le token
            final String jwt = authHeader.substring(7);

            // Extraire l'email (username) du token
            final String userEmail = jwtService.extractUsername(jwt);

            // Vérifier que l'email n'est pas null et que l'utilisateur n'est pas déjà authentifié
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Charger les détails de l'utilisateur
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                // Vérifier si le token est valide
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // Créer l'authentification
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    // Ajouter les détails de la requête
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Mettre à jour le contexte de sécurité
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            // Continuer la chaîne de filtres
            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            System.out.println("Token JWT expiré: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token expiré");
        } catch (UsernameNotFoundException e) {
            System.out.println("Utilisateur non trouvé: " + e.getMessage());
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.out.println("Erreur d'authentification JWT: " + e.getMessage());
            filterChain.doFilter(request, response);
        }
    }
}