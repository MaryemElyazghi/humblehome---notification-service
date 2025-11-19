package org.example.userr.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class AuthConfig {



    @Bean
    //juste recupere user de la base de donne
    public UserDetailsService userDetailsService() {
        // hadi hiya la classe qu on a definie et dans laquelle
        //se trouve une methode qui return un objet de type UserDetail
        //hada la methode return load user from data base by his name
        return new UtilisateurDetailService();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService()); // charge l’utilisateur
        provider.setPasswordEncoder(passwordEncoder());       // compare mot de passe hashé
        return provider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration  config) throws Exception {

        return config.getAuthenticationManager();
    }





    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // désactive CSRF avec la nouvelle API
                .cors(cors -> cors.disable()) // désactive CORS pour éviter les problèmes
                .authorizeHttpRequests(auth -> auth
                        // Permettre tous les endpoints d'authentification
                        // Le Gateway gère l'authentification pour les endpoints sécurisés
                        .requestMatchers("/authh/controller/**").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> httpBasic.disable()) // désactive httpBasic
                .formLogin(formLogin -> formLogin.disable()); // désactive formLogin

        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    //AuthenticationConfiguration agit comme un factory (usine) qui te donne un AuthenticationManager déjà configuré.


}
