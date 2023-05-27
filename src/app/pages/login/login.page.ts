import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  IonicModule,
  LoadingController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage {
  credentialForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: ChatService
  ) {
    this.credentialForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  ngOnInit() {}

  async signUp() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.chatService.signup(this.credentialForm.value).then(
      (user) => {
        loading.dismiss();
        this.router.navigateByUrl('/chat', { replaceUrl: true });
      },
      async (err) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Sign up failed',
          message: err.message,
          buttons: ['close'],
        });

        await alert.present();
      }
    );
  }

  async signIn() {
    this.credentialForm.markAllAsTouched();
    if (this.credentialForm.valid) {
      const loading = await this.loadingController.create();
      await loading.present();
      this.chatService.signIn(this.credentialForm.value).then(
        (res) => {
          loading.dismiss();
          this.router.navigateByUrl('/chat', { replaceUrl: true });
        },
        async (err) => {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: ':(',
            message: err.message,
            buttons: ['OK'],
          });

          await alert.present();
        }
      );
    }
  }

  // Easy access for form fields
  get email() {
    return this.credentialForm.get('email');
  }

  get password() {
    return this.credentialForm.get('password');
  }
}
