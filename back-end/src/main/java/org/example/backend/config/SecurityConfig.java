package org.example.backend.config;

import org.example.backend.security.JwtAuthenticationFilter;
import org.example.backend.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;

import java.util.Arrays;
import java.util.function.Supplier;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Correction de la dépréciation de cors()
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Correction pour csrf disable
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        // Routes publiques
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/stage/public/**").permitAll()
                        .requestMatchers("/api/stageAnnee/token/**").permitAll()
                        .requestMatchers("/api/stage-inscription/**").permitAll()
                        .requestMatchers("/api/appreciation/form/*").permitAll()
                        .requestMatchers("/api/appreciation/public/**").permitAll()
                        .requestMatchers("/api/tuteurs/check-email").permitAll()
                        .requestMatchers("/api/appreciation/submit").permitAll()
                        .requestMatchers("/api/appreciation/send-verification-code").permitAll()

                        // Routes pour les stagiaires
                        .requestMatchers("/api/stagaire/me").hasAuthority("STAGIAIRE")
                        // Correction de l'expression access avec AuthorizationDecision
                        .requestMatchers("/api/stagaire/{id}").access((authentication, context) ->
                                new AuthorizationDecision(
                                        authentication.get().getAuthorities().stream()
                                                .anyMatch(a -> a.getAuthority().equals("ADMIN")) ||
                                                (authentication.get().getAuthorities().stream()
                                                        .anyMatch(a -> a.getAuthority().equals("STAGIAIRE")) &&
                                                        authentication.get().getName().equals(context.getVariables().get("id")))
                                )
                        )

                        // Routes protégées pour admins seulement
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/auth/admin/register").hasAuthority("ADMIN")
                        .requestMatchers("/api/stage-annee").hasAuthority("ADMIN")
                        .requestMatchers("/api/statistiques/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/stage-annee/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/tuteurs/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/stagaire").hasAuthority("ADMIN")
                        .requestMatchers("/api/stagaire/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/stageAnnee/{id}/students-with-evaluations").hasAuthority("ADMIN")
                        .requestMatchers("/api/stageAnnee/GetAnneeUniversitaire").hasAuthority("ADMIN")

                        // Routes protégées accessibles par tous les utilisateurs authentifiés
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Changez "*" pour des origines spécifiques car allowCredentials est true
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Ajustez selon votre frontend

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Auth-Token"));
        configuration.setExposedHeaders(Arrays.asList("X-Auth-Token"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}