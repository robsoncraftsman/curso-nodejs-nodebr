//Na chamada dos callbacks, sempre passar primeiro o objeto de erro (ou null) e depois a informação

function obterUsuario(callback) {
  setTimeout(() => {
    const usuario = {
      id: 1,
      nome: "João",
    };
    callback(null, usuario);
  }, 1000);
}

function obterTelefone(idUsuario, callback) {
  if (!idUsuario) {
    callback(new Error("IdUsuario não pode ser nulo"), null);
    return;
  }

  setTimeout(() => {
    const telefone = {
      ddd: 48,
      numero: 999999999,
    };
    callback(null, telefone);
  }, 2000);
}

function obterEndereco(idUsuario, callback) {
  if (!idUsuario) {
    callback(new Error("IdUsuario não pode ser nulo"), null);
    return;
  }

  setTimeout(() => {
    const endereco = {
      logradouro: "Avenida das Jaqueiras",
      numero: 999,
    };
    callback(null, endereco);
  }, 2000);
}

obterUsuario((errUsuario, usuario) => {
  const dadosUsuario = {};
  if (errUsuario) {
    console.error("Erro ao consultar o usuário: ", errUsuario);
    return;
  }
  dadosUsuario.usuario = usuario;

  obterTelefone(usuario.id, (errTelefone, telefone) => {
    if (errTelefone) {
      console.error("Erro ao consultar o telefone: ", errTelefone);
    }
    dadosUsuario.telefone = telefone;

    obterEndereco(usuario.id, (errEndereco, endereco) => {
      if (errEndereco) {
        console.error("Erro ao consultar o endereço: ", errEndereco);
      }

      dadosUsuario.endereco = endereco;

      console.log(JSON.stringify(dadosUsuario));
    });
  });
});
