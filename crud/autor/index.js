window.onload = async () => {
    await loadData();
};

async function loadData(filtro) {

    const queryParams = filtro ? `?name=${filtro}` : "";

    const autoresResponse = await fetch(`https://localhost:44383/autor${queryParams}`, {
        method: "GET"
    });

    const autores = await autoresResponse.json();

    const tbody = document.querySelector("table#autores > tbody");
    const trs = autores.map(autor => {
        return `
            <tr>
                <!-- <td>${autor.Id}</td> -->
                <td>${autor.Nome}</td>
                <td>${formatDate(autor.Nascimento)}</td>
                <td>${formatDate(autor.Falecimento)}</td>
                <td>
                    <button onclick="openModal('${autor.Id}');">Alterar</button>
                    <button onclick="deleteAuthor('${autor.Id}');">Deletar</button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = trs.join("");
    //tbody.insertAdjacentHTML("beforeEnd", trs.join(""));
}

async function insertAuthor() {
    const nameValue = document.getElementById("nome").value;
    const birthDateValue = document.getElementById("nascimento").value;
    const passingDateValue = document.getElementById("falecimento").value || null;

    if (!nameValue) {
        Swal.fire({
            title: `Nome do autor não pode estar vazio.`,
            icon: "error"
        });
        return;
        
        //document.getElementById("erro-autor").innerHTML = "Este campo não pode estar vazio.";
    }

    if (!birthDateValue) {
        Swal.fire({
            title: `Data de nascimento do autor não pode estar vazio.`,
            icon: "error"
        });
        return;
    }

    if(passingDateValue && birthDateValue){
        const birth = new Date(birthDateValue);
        const passing = new Date(passingDateValue);

        if(passing <= birth){
            Swal.fire({
                title: `Data de falecimento não pode ser menor ou igual a data de nascimento do autor.`,
                icon: "error"
            });
            return;
        }
    }

    try {
        const postResponse = await fetch(`https://localhost:44383/autor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Nome": nameValue,
                "Nascimento": birthDateValue,
                "Falecimento": passingDateValue
            })
        });

        Swal.fire({
            title: "Autor inserido com sucesso!",
            icon: "success"
        });

        await loadData();

    } catch (error) {
        Swal.fire({
            title: `Falha ao inserir autor. Detalhes do erro: ${error}.`,
            icon: "error"
        });

        //alert(`Falha ao inserir autor. Detalhes do erro: ${error}.`);
    }
}

async function updateAuthor(id) {
    console.log(id);

    const nameValue = document.getElementById("nome").value;
    const birthDateValue = document.getElementById("nascimento").value;
    const passingDateValue = document.getElementById("falecimento").value || null;

    if (!nameValue) {
        Swal.fire({
            title: `Nome do autor não pode estar vazio.`,
            icon: "error"
        });
        return;
        
        //document.getElementById("erro-autor").innerHTML = "Este campo não pode estar vazio.";
    }

    if (!birthDateValue) {
        Swal.fire({
            title: `Data de nascimento do autor não pode estar vazio.`,
            icon: "error"
        });
        return;
    }

    if(passingDateValue && birthDateValue){
        const birth = new Date(birthDateValue);
        const passing = new Date(passingDateValue);

        if(passing <= birth){
            Swal.fire({
                title: `Data de falecimento não pode ser menor ou igual a data de nascimento do autor.`,
                icon: "error"
            });
            return;
        }
    }

    try {
        const postResponse = await fetch(`https://localhost:44383/autor`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Id": id,
                "Nome": nameValue,
                "Nascimento": birthDateValue,
                "Falecimento": passingDateValue
            })
        });

        Swal.fire({
            title: "Autor atualizado com sucesso!",
            icon: "success"
        });

        await loadData();

    } catch (error) {
        Swal.fire({
            title: `Falha ao atualizar autor. Detalhes do erro: ${error}.`,
            icon: "error"
        });

        //alert(`Falha ao inserir autor. Detalhes do erro: ${error}.`);
    }
}

async function deleteAuthor(id) {

    Swal.fire({
        title: "Você tem certeza que quer deletar esse autor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, quero deletar."
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const autoresResponse = await fetch(`https://localhost:44383/autor?id=${id}`, {
                    method: "DELETE"
                });

                Swal.fire({
                    title: "Autor removido com sucesso!",
                    icon: "success"
                });

                await loadData();

            } catch (error) {
                Swal.fire({
                    title: `Falha ao remover autor. Detalhes do erro: ${error}.`,
                    icon: "error"
                });

                //alert(`Falha ao inserir autor. Detalhes do erro: ${error}.`);
            }
        }
    });
}

function filter() {
    const value = document.getElementById("filtro").value;
    loadData(value);
}

async function openModal(id) {

    let autor = null;

    if (id) {
        const autoresResponse = await fetch(`https://localhost:44383/autor?id=${id}`, {
            method: "GET"
        });

        autor = await autoresResponse.json();
    }

    Swal.fire({
        // width: "80%",
        showConfirmButton: false,
        // showClass: {
        //     popup: "animate__animated animate__fadeIn animate__faster"
        // },
        // hideClass: {
        //     popup: "animate__animated animate__fadeOut animate__faster"
        // },
        html: `
            <div class="flex-rows">
                <label for="nome">Nome</label>
                <input type="text" name="nome" id="nome" value="${autor ? autor.Nome : ""}">
                <div class="error-message" id="erro-autor"></div>
                
                <label for="nascimento">Data de Nascimento</label>
                <input type="date" name="nascimento" id="nascimento" value="${autor ? autor.Nascimento.split("T")[0] : ""}">
                
                <label for="falecimento">Data de Falecimento</label>
                <input type="date" name="falecimento" id="falecimento" value="${autor ? autor.Falecimento?.split("T")[0] : ""}">
                <br>
                <button onclick="${!autor ? "insertAuthor();" : `updateAuthor('${id}');`}" >SALVAR</button>
            </div>
        `
    });
}

function formatDate(d) {
    if (!d) {
        return "alive";
    }

    const date = new Date(d);
    const year = ("0000" + date.getFullYear()).slice(-4);
    const month = ("00" + (date.getMonth() + 1)).slice(-2);
    const day = ("00" + date.getDate()).slice(-2);

    return `${day}/${month}/${year}`;
}