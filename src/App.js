import React, { useState } from "react";

function App() {
  const [pessoas, setPessoas] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [cpf, setCpf] = useState("");
  const [erroNumero, setErroNumero] = useState("");
  const [erroCpf, setErroCpf] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [pesquisa, setPesquisa] = useState("");

  const handleNumeroChange = (e) => {
    const valorDigitado = e.target.value.replace(/\D/g, "");
    if (valorDigitado.length <= 9) {
      setNumero(valorDigitado);
    }
  };

  const handleCpfChange = (e) => {
    const valorDigitado = e.target.value.replace(/\D/g, "");
    if (valorDigitado.length <= 11) {
      setCpf(valorDigitado);
    }
  };

  const validarNumero = () => {
    if (numero.length !== 9) {
      setErroNumero("Número deve conter exatamente 9 dígitos (ex: 912345678)");
      return false;
    }
    setErroNumero("");
    return true;
  };

  const validarCpf = () => {
    if (cpf.length !== 11) {
      setErroCpf("CPF deve conter exatamente 11 dígitos (ex: 12345678901)");
      return false;
    }
    setErroCpf("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarNumero() || !validarCpf()) {
      return;
    }

    const numeroCompleto = `+55 11 ${numero}`;
    const cpfCompleto = cpf;

    if (editandoId !== null) {
      setPessoas(pessoas.map(pessoa =>
        pessoa.id === editandoId ? { id: editandoId, nome, email, numero: numeroCompleto, cpf: cpfCompleto } : pessoa
      ));
    } else {
      const novaPessoa = {
        id: Date.now(),
        nome,
        email,
        numero: numeroCompleto,
        cpf: cpfCompleto,
      };
      setPessoas([...pessoas, novaPessoa]);
    }

    limparFormulario();
  };

  const handleEditar = (pessoa) => {
    setNome(pessoa.nome);
    setEmail(pessoa.email);
    setNumero(pessoa.numero.replace("+55 11 ", "").replace(/\D/g, ""));
    setCpf(pessoa.cpf);
    setEditandoId(pessoa.id);
    setErroNumero("");
    setErroCpf("");
  };

  const handleDeletar = (id) => {
    const confirmar = window.confirm("Deseja mesmo excluir esta pessoa?");
    if (confirmar) {
      setPessoas(pessoas.filter(pessoa => pessoa.id !== id));
    }
  };

  const limparFormulario = () => {
    setNome("");
    setEmail("");
    setNumero("");
    setCpf("");
    setErroNumero("");
    setErroCpf("");
    setEditandoId(null);
  };

  const pessoasFiltradas = pessoas.filter(pessoa =>
    pessoa.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    pessoa.email.toLowerCase().includes(pesquisa.toLowerCase()) ||
    pessoa.numero.replace(/\D/g, "").includes(pesquisa.replace(/\D/g, "")) ||
    pessoa.cpf.replace(/\D/g, "").includes(pesquisa.replace(/\D/g, ""))
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Registro de clientes</h1>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Adicionar Nova Pessoa</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <div style={styles.phoneField}>
            <span style={styles.phonePrefix}>+55 11</span>
            <input
              type="text"
              placeholder="Número (9 dígitos)"
              value={numero}
              onChange={handleNumeroChange}
              required
              style={{ ...styles.input, paddingLeft: "90px" }}
            />
          </div>
          {erroNumero && <p style={styles.errorMessage}>{erroNumero}</p>}
          <div style={styles.phoneField}>
            <span style={styles.phonePrefix}>CPF</span>
            <input
              type="text"
              placeholder="CPF (11 dígitos)"
              value={cpf}
              onChange={handleCpfChange}
              required
              style={{ ...styles.input, paddingLeft: "90px" }}
            />
          </div>
          {erroCpf && <p style={styles.errorMessage}>{erroCpf}</p>}
          <button type="submit" style={styles.addButton}>
            {editandoId ? "Atualizar" : "Adicionar"}
          </button>
        </form>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Lista de Pessoas</h2>

        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Pesquisar por número ou CPF..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <ul style={styles.list}>
          {pessoasFiltradas.map((pessoa) => (
            <li key={pessoa.id} style={styles.listItem}>
              <div style={styles.personInfo}>
                <span style={styles.profileIcon}>👤</span>
                <div>
                  <strong>{pessoa.nome}</strong> - {pessoa.email} - {pessoa.numero} - {pessoa.cpf}
                </div>
              </div>
              <div>
                <button onClick={() => handleEditar(pessoa)} style={styles.editButton}>Editar</button>
                <button onClick={() => handleDeletar(pessoa.id)} style={styles.deleteButton}>Deletar</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#121212",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#e0e0e0",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    color: "#f0f0f0",
  },
  section: {
    backgroundColor: "#1e1e1e",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#ffffff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #444",
    fontSize: "16px",
    backgroundColor: "#2a2a2a",
    color: "#fff",
  },
  phoneField: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  phonePrefix: {
    position: "absolute",
    left: "15px",
    color: "#bbb",
    fontSize: "14px",
  },
  errorMessage: {
    color: "#ff5252",
    fontSize: "14px",
    marginTop: "-10px",
    marginBottom: "10px",
  },
  addButton: {
    backgroundColor: "#5a67d8",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    alignSelf: "flex-end",
    marginTop: "10px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "20px",
  },
  listItem: {
    backgroundColor: "#2c2c2c",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editButton: {
    marginRight: "10px",
    padding: "6px 10px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px",
  },
  deleteButton: {
    padding: "6px 10px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px",
  },
  searchContainer: {
    position: "relative",
    marginBottom: "20px",
  },
  searchIcon: {
    position: "absolute",
    top: "50%",
    left: "15px",
    transform: "translateY(-50%)",
    fontSize: "18px",
    color: "#aaa",
  },
  searchInput: {
    width: "96%",
    padding: "10px 10px 10px 40px",
    borderRadius: "8px",
    border: "1px solid #444",
    fontSize: "16px",
    backgroundColor: "#2a2a2a",
    color: "#fff",
  },
  personInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  profileIcon: {
    fontSize: "24px",
    color: "#5a67d8",
  },
};

export default App;
