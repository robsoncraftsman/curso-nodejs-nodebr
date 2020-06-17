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

async function main() {
  console.time("main");

  const usuario = await obterUsuario();
  const telefone = await obterTelefone(usuario.id);
  const endereco = await obterEndereco(usuario.id);

  const dadosUsuario = { usuario, telefone, endereco };
  console.log(JSON.stringify(dadosUsuario));

  console.timeEnd("main");
}

async function mainTurbo() {
  console.time("mainTurbo");

  const usuario = await obterUsuario();
  const [telefone, endereco] = await Promise.all([
    obterTelefone(usuario.id),
    obterEndereco(usuario.id),
  ]);

  const dadosUsuario = { usuario, telefone, endereco };
  console.log(JSON.stringify(dadosUsuario));

  console.timeEnd("mainTurbo");
}

main();
mainTurbo();
