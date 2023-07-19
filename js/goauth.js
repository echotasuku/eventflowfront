
function jwtDecode (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


function loginCallback(resp){
    cred = jwtDecode(resp.credential)

    console.log(cred);
    var userData = {
    id: cred.exp,
    name: cred.name,
    email: cred.email
  };

  $.ajax(URL_BASE + "usuarios", {
    data: JSON.stringify(userData),
    method: "POST",
    contentType: "application/json"
  })

  .done(function(res) {
    console.log("Usuário salvo com sucesso:", res);
    localStorage.setItem("gauth-token", resp.credential);
    setLoginStatus(cred);
  })
  .fail(function(res) {
    console.error("Erro ao salvar usuário:", res);
  });
}

function logout(){
    localStorage.setItem("gauth-token", undefined);
    document.querySelector(".g_id_logado").innerHTML = "";
    document.querySelector(".g_id_signin").style.display = 'block';
}


function setLoginStatus(cred){
    console.log(cred);
    document.querySelector(".g_id_signin").style.display = 'none';
    html = `<div class='g_login'>
                <img class='g_pic' src="${cred.picture}">
                <span><div class='g_name'>${cred.given_name} ${cred.family_name}</div><div class='g_email'>${cred.email}</div></span>
                <a href='#' onclick='logout()'>Logout</a>
            </div>`
    document.querySelector(".g_id_logado").innerHTML = html;
}

function getGoogleId(){
    if (localStorage.getItem("gauth-token") != undefined){
        cred = jwtDecode(localStorage.getItem("gauth-token"));
        return cred.exp;
    } else {
        return null;
    }
}

window.addEventListener("load",() => {
    if (localStorage.getItem("gauth-token") != undefined){
        cred = jwtDecode(localStorage.getItem("gauth-token"));
        setLoginStatus(cred);
    }
});


