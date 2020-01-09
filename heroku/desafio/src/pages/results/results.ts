import { NotFoundPage } from './../not-found/not-found';
import { Component } from '@angular/core';
import axios from 'axios';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the ResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
const API = "https://api.github.com/users/";
@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {
  public login:string = '';
  public avatar;
  public bio;
  public seguindo;
  public seguidores;
  public email;
  public nome;
  public repos:any = [];
  mensagemErro: string = "Usuário não encontrado";

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {

    //salva os parâmetros recebidos da página de busca
    this.login = navParams.get('login');
    this.avatar = navParams.get('avatar');
    this.bio = navParams.get('bio');
    this.seguindo = navParams.get('seguindo');
    this.seguidores = navParams.get('seguidores');
    this.email = navParams.get('email');
    this.nome = navParams.get('nome');
    this.processarRepos();
  }


  //inicia a busca de um novo usuário
  async procurar() {
    var username = this.login;
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

  //processa os resultados obtidos mediante a busca
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

  //caso ocorra algum erro, o usuário é redirecionado para a página de erro
  erro() {
    this.navCtrl.push(NotFoundPage);
  }
  
  //retorna o valor do login
  showLogin() {
    return this.login;
  }

  //executa o processamento dos repositórios do usuário buscado
  async processarRepos() {
    var repos = await axios.get(API + this.login + '/repos');
    repos.data.forEach(element => {
      this.repos.push(element);
    });
    this.repos.sort(this.sortFunction); 
  }

  //realiza a ordenação dos valores
  sortFunction(a, b){
    return (b.stargazers_count - a.stargazers_count)
  }

  //retorna o valor do nome
  showName() {
    return this.nome;
  }

  //retorna o valor da bio do usuário
  showBio() {
    return this.bio;
  }

  //retorna o valor dos seguidos
  showSeguindo() {
    return this.seguindo;
  }

  //retorna o valor dos seguidores
  showSeguidores() {
    return this.seguidores;
  }

  //retorna o valor do email
  showEmail() {
    if (this.email != null) {
      this.email = this.email;
    } else {
      this.email = 'Sem email registrado!';
    }
    return this.email;
  }

  //retorna o valor da imagem
  showImage() {
    return this.avatar;
  }

}
