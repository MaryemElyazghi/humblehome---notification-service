import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = {
    email: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    
    // Appeler directement performLogin (le délai est déjà dans login())
    this.performLogin();
  }

  private async performLogin() {
    const email = this.loginForm.email.toLowerCase().trim();
    const password = this.loginForm.password;
    
    try {
      // TODO: Le développeur devra implémenter l'appel API réel
      // Appeler l'API backend pour obtenir le token
      const success = await this.authService.login(email, password);
      
      if (success) {
        // Attendre un peu pour s'assurer que les rôles sont bien définis
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Récupérer les rôles de l'utilisateur
        const roles = this.authService.getCurrentRoles();
        const isAdmin = roles.includes('ROLE_ADMIN') || this.isAdminEmail(email);
        
        console.log('Login successful. Roles:', roles, 'Is Admin:', isAdmin);
        
        // Rediriger selon le rôle
        if (isAdmin) {
          this.router.navigate(['/admin']).then(() => {
            console.log('Redirection vers /admin réussie');
          }).catch(err => {
            console.error('Erreur de redirection vers /admin:', err);
            this.errorMessage = 'Erreur de redirection';
          });
        } else {
          this.router.navigate(['/user']).then(() => {
            console.log('Redirection vers /user réussie');
          }).catch(err => {
            console.error('Erreur de redirection vers /user:', err);
            this.errorMessage = 'Erreur de redirection';
          });
        }
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
    } finally {
      this.isLoading = false;
    }
  }

  // Helper pour déterminer si l'email est celui de l'admin
  private isAdminEmail(email: string): boolean {
    const adminEmails = [
      'admin@humblehome.com',
      'admin@example.com',
      'administrator@humblehome.com'
    ];
    return adminEmails.includes(email.toLowerCase().trim());
  }
}
