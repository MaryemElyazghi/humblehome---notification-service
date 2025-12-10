package org.example.userr.service;


import org.example.userr.entity.UserCredential;
import org.example.userr.event.UserRegisteredEvent;  // ✅ NOUVEAU
import org.example.userr.feign.CartClient;
import org.example.userr.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;  // ✅ NOUVEAU
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // c est le nom de la methode dans config
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CartClient cartClient;

    @Autowired  // ✅ NOUVEAU
    private ApplicationEventPublisher eventPublisher;
//
//    public String saveUser(UserCredential userCredential) {
//        // Encoder le mot de passe
//        userCredential.setPassword(passwordEncoder.encode(userCredential.getPassword()));
//
//        // S'assurer que l'utilisateur est actif par défaut
//        if (!userCredential.isActif()) {
//            userCredential.setActif(true);
//        }
//
//        // Si prenom n'est pas fourni, on peut le mettre à null ou à une valeur par défaut
//        if (userCredential.getPrenom() == null || userCredential.getPrenom().isEmpty()) {
//            userCredential.setPrenom(""); // Ou une valeur par défaut
//        }
//
//        userRepository.save(userCredential);
//        return "user added to the database";
//    }



    public String saveUser(UserCredential userCredential) {
        // Encoder le mot de passe
        userCredential.setPassword(passwordEncoder.encode(userCredential.getPassword()));

        // S'assurer que l'utilisateur est actif par défaut
        if (!userCredential.isActif()) {
            userCredential.setActif(true);
        }

        if (userCredential.getPrenom() == null || userCredential.getPrenom().isEmpty()) {
            userCredential.setPrenom("");
        }

        // Sauvegarder l'utilisateur
        userRepository.save(userCredential);

        // 🔹 Créer automatiquement le panier pour l'utilisateur
        cartClient.createCartForUser(userCredential.getId());

        // ✅ PUBLIER L'ÉVÉNEMENT
        eventPublisher.publishEvent(new UserRegisteredEvent(this, userRepository.save(userCredential)));

        return "User added and cart created";
    }


    public String generateToken(String usrename  ) {

        return jwtService.generateToken( usrename  );
    }


    public void  validateToken(String token) {
          jwtService.validateToken(token);
    }




    public UserCredential findUserByUsername(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
