function obterUsuario() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuario = {
        id: 1,
        nome: "João",
      };
      resolve(usuario);
    }, 1000);
  });
}

function obterTelefone(idUsuario) {
  return new Promise((resolve, reject) => {
    if (!idUsuario) {
      reject(new Error("IdUsuario não pode ser nulo"));
      return;
    }

    setTimeout(() => {
      const telefone = {
        ddd: 48,
        numero: 999999999,
      };
      resolve(telefone);
    }, 2000);
  });
}

function obterEndereco(idUsuario) {
  return new Promise((resolve, reject) => {
    if (!idUsuario) {
      reject(new Error("IdUsuario não pode ser nulo"));
      return;
    }

    setTimeout(() => {
      const endereco = {
        logradouro: "Avenida das Jaqueiras",
        numero: 999,
      };
      resolve(endereco);
    }, 2000);
  });
}

obterUsuario()
  .then((usuario) => {
    const dadosUsuario = {};

    dadosUsuario.usuario = usuario;

    obterTelefone(usuario.id)
      .then((telefone) => {
        dadosUsuario.telefone = telefone;

        obterEndereco(usuario.id)
          .then((endereco) => {
            dadosUsuario.endereco = endereco;

            console.log(JSON.stringify(dadosUsuario));
          })
          .catch((errEndereco) => {
            console.error("Erro ao consultar o endereço", errEndereco);
          });
      })
      .catch((errTelefone) => {
        console.error("Erro ao consultar o telefone: ", errTelefone);
      });
  })
  .catch((errUsuario) => {
    console.error("Erro ao consultar o usuário: ", errUsuario);
  });
