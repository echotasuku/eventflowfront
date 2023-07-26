var URL_BASE = "http://localhost:8080/"
var URL_EDIT = null;


$(function(){
     //verificarAutenticacao();
     
    $('#submit').click(save);
      updateList();
     
});

// Função para verificar a autenticação
//function verificarAutenticacao() {
    //$.ajax(URL_BASE + "verificar-autenticacao", {
        //method: 'get',
    //}).done(function(res) {
        // O usuário está autenticado, habilitar o botão de cadastro ou exibir o conteúdo relacionado ao cadastro
       // $('#submit').prop('disabled', false);
        // ...
        // Chamar a função para listar os eventos após verificar a autenticação
       // updateList();
    //}).fail(function(res) {
        // O usuário não está autenticado, desabilitar o botão de cadastro ou ocultar o conteúdo relacionado ao cadastro
      //  $('#submit').prop('disabled', true);
        // ...
    //});
//}





//deletar
function del(url){
    if (confirm("Deseja realmente deletar esse registro?")){
        //envia para o backend
        $.ajax(url,{
            method:'delete',
        }).done(function(res) {
            //atualiza a lista após salvar
            updateList();
        })
        .fail(function(res) {
            console.log(res);
        });
    }
}



//salvar
function save(){
    if (!localStorage.getItem("gauth-token")) {
        // Exibir o modal de aviso
        $('#loginModal').modal('show');
        return;
    }

    
    dados = $('#title,#date_event,#time_event,#location,#description').serializeJSON();
    //dados["usuario"] = $('#name,#email').serializeJSON();

    // console.log(d);
    console.log(dados);


    //caso esteja editando
    if (URL_EDIT != null) {
        //envia para a url do objeto
        url = URL_EDIT;
        method = "PUT";
    } else {
        //caso contrário, envia para a url de salvar
        url = URL_BASE + "events";
        method = "POST";
    }

    console.log(url)

   dados['usuario'] = URL_BASE + "usuarios/" + getGoogleId(); 
    if(dados['title']!=='' && dados['location']!==''){
        $.ajax(url,{
            data:JSON.stringify(dados),
            method:method,
            contentType: "application/json",
        }).done(function(res) {
            console.log(res);

            URL_EDIT = URL_BASE + "events" + res.id;


            updateList();
        })
        .fail(function(res) {
            console.log(res);
        });  
    }
    
}

//listar

function updateList(){

    $.ajax(URL_BASE+"events",{
        method:'get',
    }).done(function(res) {

        let table = $('#tableContent');
        table.html("");
        $(res._embedded.events).each(function(k,el){
            let events = el;
            tr = $(`<tr>
            <td>
             <a href="#" onclick="edit('${events._links.self.href}')">Editar</a>
            </td>
            <td>${events.title}</td>
            <td>${events.location}</td>
             <td>${events.description}</td>
              <td>${events.date_event}</td>
               <td>${events.time_event}</td>
                <td><a href="#" onclick="del('${events._links.self.href}')">Deletar</a></td>
</tr>`);
            table.append(tr);
        })
       
    })
    .fail(function(res) {
        let table = $('#tableContent');
        table.html("");
        tr = $(`<tr><td colspan='4'>Não foi possível carregar a lista</td></tr>`);
        table.append(tr);
    });
}


//editar

function edit(url){
    //Primeiro solicita as informações da pessoa ao backend
    $.ajax(url,{
        method:'get',
    }).done(function(res) {

        /*$.each(res,function(k, el){
            $('#'+k).val(el);
        });*/
        $('#title').val(res.title);
        $('#date_event').val(res.date_event);
        $('#time_event').val(res.time_event);
        $('#location').val(res.location);
        $('#description').val(res.description);
        //$('#street').val(res.address.street);
       
    });
    //salva a url do objeto que estou editando
    URL_EDIT = url;
}











