import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./CadastroPaciente.css";
//import InputMask from 'react-input-mask';

const CadastroPaciente = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Função para validar a data no formato dd/mm/yyyy
  const validarDataNascimento = (dataNascimento) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dataNascimento)) return false;
    const [dia, mes, ano] = dataNascimento.split("/").map(Number);
    if (mes < 1 || mes > 12) return false;

    // Validação dos dias
    const diasNoMes = new Date(ano, mes, 0).getDate();
    if (dia < 1 || dia > diasNoMes) return false;

    // Validação dos anos (ajuste o intervalo conforme necessário)
    if (ano < 1900 || ano > new Date().getFullYear()) return false;
    const dataObj = new Date(ano, mes - 1, dia);
    return (
      dataObj.getFullYear() === ano &&
      dataObj.getMonth() === mes - 1 &&
      dataObj.getDate() === dia
    );
  };

  //data de nascimento handle
  const handleInputChange = (e) => {
    const valor = e.target.value;
    const valorFormato = valor.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    setDataNascimento(valorFormato);
  };

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    senha: "",
    confirmaSenha: "",
    //dataNascimento: "",
    cns: "",
    telefone: "",
    //termo: false,
    //compartilhamento: false,
  });

  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [showSenhaMessage, setShowSenhaMessage] = useState(false);

  const [dataNascimento, setDataNascimento] = useState("");

  const [telefone, setTelefone] = useState("");

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  // Funções de validação
  const validarNome = (nomeCompleto) =>
    /^[A-Za-zÀ-ÖØ-ÿ\s]+$/.test(nomeCompleto);
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarSenhas = () => {
    return senha === confirmaSenha;
  };
  const validarConfirmaSenha = (senha, confirmarSenha) => {
    if (senha !== confirmarSenha) {
      return false;
    }
    return true;
  };

  const validarCns = (cns) => /^\d{15}$/.test(cns);

  const validarTelefone = (telefone) => {
    const regex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{4})$/;
    if (!regex.test(telefone)) {
      return telefone; // retorna o telefone original se não estiver no formato correto
    }
    const formattedTelefone = telefone.replace(regex, "($1) $2-$3");
    return formattedTelefone;
  };

  const validarSenhaEConfirmarSenha = () => {
    if (!validarSenhas(senha)) {
      erros.senha =
        "A senha deve ser forte: símbolo, número e letra maiúscula.";
    }
    if (senha !== confirmaSenha) {
      erros.confirmarSenha = "As senhas não conferem.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Nova lista de erros
    const errosValidacao = {};

    // Validações
    if (!validarNome(formData.nomeCompleto))
      errosValidacao.nomeCompleto =
        "O nome não deve conter símbolos ou números.";
    if (!validarEmail(formData.email))
      errosValidacao.email = "O e-mail fornecido é inválido.";
    if (!validarSenhas(formData.senha))
      errosValidacao.senha =
        "A senha deve ser forte: símbolo, número e letra maiúscula.";
    if (!validarConfirmaSenha(senha, confirmaSenha)) {
      errosValidacao.confirmarSenha = "As senhas não conferem.";
    }
    if (!validarDataNascimento(formData.dataNascimento))
      errosValidacao.dataNascimento =
        "A data deve estar no formato dd/mm/yyyy e ser uma data válida.";
    if (!validarCns(formData.cns))
      errosValidacao.cns = "O CNS deve ter 15 dígitos.";
    if (!validarTelefone(formData.telefone))
      errosValidacao.telefone = "O número de telefone precisa ter 11 números.";
    if (!validarSenhaEConfirmarSenha()) {
      return;
    }

    // Atualiza o estado de erros
    setErros(errosValidacao);

    if (Object.keys(erros).length > 0) {
      setErros(erros);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/Paciente/register`);
      console.log(response);
      if (response.data.sucesso) {
        alert(response.data.message);
        navigate("/perfil");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Ocorreu um erro ao enviar os dados. Por favor, tente novamente.");
    }
  };

  const checkButtonEnable = () => {
    if (!checkbox1 && !checkbox2) {
      setButtonEnabled(false);
      console.log("Checkbox Termos Confirmada");
    } else {
      setButtonEnabled(true);
      console.log("Checkbox Compartilhar Confirmada");
    }
  };

  const handleCheckboxChange = (checkbox, value) => {
    if (checkbox === "checkbox1") {
      setCheckbox1(value);
    } else if (checkbox === "checkbox2") {
      setCheckbox2(value);
    }
    checkButtonEnable();
  };

  return (
    <main className="cadastro-container">
      <section className="cadastro-card">
        <header className="text-center mb-4">
          <div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/")}
            ></button>
            <h1 className="text-center mb-4">Cadastro Paciente</h1>
          </div>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              {/* Primeira Coluna */}
              <article className="mb-3">
                <label
                  htmlFor="nomeCompleto"
                  className="form-label"
                  aria-label="Nome Completo"
                >
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nomeCompleto"
                  placeholder="Nome Completo"
                  className="form-control"
                  value={formData.nomeCompleto}
                  onChange={(e) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      nomeCompleto: e.target.value,
                    }))
                  }
                  aria-label="Insira o nome do paciente"
                  aria-required="true"
                  required
                />
                {erros && (
                  <div className="error-messages">
                    {Object.keys(erros).map((key, index) => (
                      <p key={index}>{erros[key]}</p>
                    ))}
                  </div>
                )}
              </article>
              <article className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="nome@email.com"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      email: e.target.value,
                    }))
                  }
                  aria-label="Insira o e-mail do paciente"
                  required
                />
                {erros.email && <p className="text-danger">{erros.email}</p>}
              </article>
              <article className="mb-3">
                <label
                  htmlFor="senha"
                  className="form-label"
                  aria-label="Senha"
                >
                  Senha
                </label>
                <div className="input-container">
                  <input
                    type="password"
                    id="senha"
                    placeholder="Digite sua senha"
                    className="form-control"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    aria-label="Insira a senha do paciente"
                    aria-required="true"
                    required
                  />
                  <div className="vazio">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        id="showSenha1"
                        name="check"
                        value="checkbox"
                        hidden
                        onClick={(e) => {
                          if (e.target.checked) {
                            document.getElementById("senha").type = "text";
                          } else {
                            document.getElementById("senha").type = "password";
                          }
                        }}
                      />
                      <img src={"olhafechado.jpg"} alt="Checkbox image" />
                    </label>
                  </div>
                </div>
                <ul className="senha-requisitos">
                  <li>
                    {validarSenhas(senha) ? (
                      <i className="fas fa-check text-sucess"></i>
                    ) : (
                      <i className="fas fa-times text-danger"></i>
                    )}
                    <span>As senhas devem ser iguais.</span>
                  </li>
                  <li>
                    {senha.match(/[A-Z]/) ? (
                      <i className="fas fa-check text-success"></i>
                    ) : (
                      <i className="fas fa-times text-danger"></i>
                    )}
                    <span>Deve conter uma letra maiúscula.</span>
                  </li>
                  <li>
                    {senha.match(/[0-9]/) ? (
                      <i className="fas fa-check text-success"></i>
                    ) : (
                      <i className="fas fa-times text-danger"></i>
                    )}
                    <span>Deve conter um número.</span>
                  </li>
                  <li>
                    {senha.match(/[^a-zA-Z0-9]/) ? (
                      <i className="fas fa-check text-success"></i>
                    ) : (
                      <i className="fas fa-times text-danger"></i>
                    )}
                    <span>Deve conter um caractere especial.</span>
                  </li>
                </ul>
                {erros.senha && <p className="text-danger">{erros.senha}</p>}
              </article>
              <article className="mb-3">
                <label htmlFor="confirmaSenha" className="form-label">
                  Confirmar Senha
                </label>
                <div className="input-container">
                  <input
                    type="password"
                    id="confirmaSenha"
                    placeholder="Confirme sua senha"
                    className="form-control"
                    value={confirmaSenha}
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                    onFocus={() => setShowSenhaMessage(true)}
                    required
                  />
                  <div className="vazio">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        id="showSenha2"
                        name="check"
                        value="checkbox"
                        hidden
                        onClick={(e) => {
                          if (e.target.checked) {
                            document.getElementById("confirmaSenha").type =
                              "text";
                          } else {
                            document.getElementById("confirmaSenha").type =
                              "password";
                          }
                        }}
                      />
                      <img src={"olhafechado.jpg"} alt="Checkbox image" />
                    </label>
                  </div>
                </div>
                {showSenhaMessage && // Adicionado condição para mostrar a mensagem
                  (confirmaSenha === senha ? (
                    <p className="text-success">Senhas conferem!</p>
                  ) : (
                    <p className="text-danger">Senhas não conferem.</p>
                  ))}
              </article>
            </div>
            <div className="col-md-6">
              {/* Segunda Coluna */}
              <article className="mb-3">
                <label htmlFor="dataNascimento" className="form-label">
                  Data de Nascimento
                </label>
                <input
                  type="text"
                  id="dataNascimento"
                  placeholder="DD/MM/YYYY"
                  className="form-control"
                  value={dataNascimento}
                  onChange={handleInputChange}
                  aria-label="Data de nascimento"
                  required
                />
                {erros.dataNascimento && (
                  <p className="text-danger">{erros.dataNascimento}</p>
                )}
              </article>
              <article className="mb-3">
                <label htmlFor="cns" className="form-label">
                  CNS
                </label>
                <input
                  type="text"
                  id="cns"
                  placeholder="Digite seu CNS"
                  className="form-control"
                  value={formData.cns}
                  onChange={(e) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      cns: e.target.value,
                    }))
                  }
                  required
                />
                {erros.cns && <p className="text-danger">{erros.cns}</p>}
              </article>
              <article className="mb-3">
                <label htmlFor="telefone" className="form-label">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  className="form-control"
                  value={telefone}
                  onChange={(e) => {
                    const telefoneFormatado = validarTelefone(e.target.value);
                    setTelefone(telefoneFormatado);
                  }}
                  required
                />
                {erros.telefone && (
                  <p className="text-danger">{erros.telefone}</p>
                )}
              </article>
              <div className="row">
                <div className="col-md-12">
                  <article className="mb-3">
                    <label className="form-label">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="termo"
                          className="form-check-input"
                          onChange={(e) =>
                            handleCheckboxChange("checkbox1", e.target.checked)
                          }
                          aria-label="Concordo com o Termo de Uso"
                          required
                        />
                        <label className="form-check-label" htmlFor="termo">
                          Eu li e concordo com os{" "}
                          <a
                            href="/termos-e-condicoes"
                            style={{ color: "var(--secondary-color)" }}
                          >
                            Termos e Condições
                          </a>{" "}
                          e a{" "}
                          <a
                            href="./privacidade"
                            style={{ color: "var(--secondary-color)" }}
                          >
                            Política de Privacidade.
                          </a>
                        </label>
                      </div>
                    </label>
                  </article>
                  <article className="mb-3">
                    <label className="form-label">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="compartilhar"
                          className="form-check-input"
                          onChange={(e) =>
                            handleCheckboxChange("checkbox2", e.target.checked)
                          }
                          aria-label="Autorizo o compartilhamento de meus dados"
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="compartilhamento"
                        >
                          Eu permito e concordo com o {""}
                          <a
                            href="./compartilhar"
                            style={{ color: "var(--secondary-color)" }}
                          >
                            Compartilhamento de Informações Médicas
                          </a>{" "}
                          para o aplicativo e os profissionais da saúde.
                        </label>
                      </div>
                    </label>
                  </article>
                </div>
              </div>
            </div>
          </div>
          <footer>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!buttonEnabled}
              aria-label="Cadastrar paciente"
              onClick={() => navigate("/perfil")}
            >
              Enviar Dados
              {/* {loading ? "Carregando..." : "Cadastrar"} */}
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CadastroPaciente;
