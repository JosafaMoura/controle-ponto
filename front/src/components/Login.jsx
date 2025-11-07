
import logo from "../imagens/logo/Logotipo.png";
function Login() {
  return (
    <div className="login-container">
      
      <img src={logo} alt="Logo" className="logo" />
      <h2>Insira seu E-mail e Senha</h2>

      <form>
        <div className="campo">
          <label htmlFor="usuario">E-mail:</label>
          <input type="text" id="usuario" placeholder="endereço@email.com" required />
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha:</label>
          <input type="password" id="senha" placeholder="Senha" required />
        </div>

        <div className="politica">
          <input type="checkbox" id="termos" required />
          <label htmlFor="termos">
            Ao clicar em continuar, você concorda com os nossos
            <a href="#"> termos de serviço</a> e
            <a href="#"> políticas de privacidade</a>.
          </label>
        </div>

        <button type="submit" className="btn-login">Entrar</button>

        <div className="links">
          <a href="#">Esqueci minha senha</a> | <a href="#">Criar Conta</a>
        </div>

        
        <div class="erro-login" id="erro-login">
          Usuário ou senha incorretos!
        </div>
      </form>
    </div>
  );
}

export default Login;


