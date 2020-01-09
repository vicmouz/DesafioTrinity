import { NotFoundPage } from './../not-found/not-found';
import { ResultsPage } from './../results/results';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import axios from 'axios';



const API = "https://api.github.com/users/";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username: string = "";
  mensagemErro: string = "Usuário não encontrado";

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }

  //inicia a busca pelo usuário pesquisado
  async procurar() {
    var username = this.username;
    var response;
    var repos;
    try {
      response = await axios.get(API + username);
      repos = await axios.get(API + username + '/repos')
      this.results(response, repos);
    } catch {
      let modal = this.modalCtrl.create(NotFoundPage, {username: username});
      modal.present();
    }

  }

  //após o processamento da busca, os resultados são processados
  results(res, repos) {
    var login;
    var avatar;
    var bio;
    var seguindo;
    var seguidores;
    var email;
    var nome;
    var repos;
    if (res.status === 200) {

      login = res.data.login;
      avatar = res.data.avatar_url;
      bio = res.data.bio;
      seguindo = res.data.following;
      seguidores = res.data.followers;
      email = res.data.email;
      nome = res.data.name;
      repos = repos;
      this.navCtrl.push(ResultsPage, {
        login: login,
        avatar: avatar,
        bio: bio,
        seguindo: seguindo,
        seguidores: seguidores,
        email: email,
        nome: nome,
        repos: repos
      });
    } else {
      this.erro();
    }
  }

  //caso ocorra algum erro, o usuário será redirecionado para a página de erro
  erro() {
    this.navCtrl.push(NotFoundPage);
  }
}
