const intro = document.getElementById("intro");
const videoIntro = document.getElementById("introVideo");
const introtext = document.getElementById("introtext");
const precamera = document.getElementById("precamera");
const conteudotext = document.getElementById("conteudotext");

const video2 = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const foto = document.getElementById("fotoFinal");
const cameraContainer = document.getElementById("camera-container");

const btn = document.getElementById("capture");
const voltar = document.getElementById("voltar");
const btnIrCamera = document.getElementById("irCamera");
const voltarInstrucao = document.getElementById("voltarInstrucao");

let streamAtual = null;

function mostrarTela(tela) {
    intro.style.display = "none";
    introtext.style.display = "none";
    precamera.style.display = "none";
    conteudotext.style.display = "none";
    
    // Usamos flex para centralizar os itens dentro das telas
    tela.style.display = "flex";
}

/* 🎬 INTRO */
videoIntro.addEventListener("ended", () => {
    mostrarTela(introtext);
    setTimeout(() => {
        mostrarTela(precamera);
    }, 8000);
});

/* 📷 ABRIR CÂMERA */
async function abrirCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
        });
        streamAtual = stream;
        video2.srcObject = stream;
    } catch (err) {
        console.error("Erro ao acessar câmera:", err);
    }
}

/* 👉 IR PARA CÂMERA */
btnIrCamera.addEventListener("click", () => {
    mostrarTela(conteudotext);
    abrirCamera();
});

/* 📸 TIRAR FOTO E ENVIAR */
btn.addEventListener("click", () => {
    // Pega o tamanho real do vídeo
    const w = video2.videoWidth;
    const h = video2.videoHeight;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    
    // Desenha a foto no canvas
    ctx.drawImage(video2, 0, 0, w, h);

    canvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", "foto-pier");

        // Opcional: mostrar um aviso de "carregando" aqui
        btn.innerText = "...";

        fetch("https://api.cloudinary.com/v1_1/dirryk3le/image/upload", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            // MOSTRAR RESULTADO E ESCONDER CÂMERA
            foto.src = data.secure_url;
            
            cameraContainer.style.display = "none"; // Esconde o container da câmera
            foto.style.display = "block";           // Mostra a foto que veio da nuvem
            voltar.style.display = "block";         // Mostra o botão para resetar
            
            btn.innerText = ""; // Limpa texto do botão de captura
        })
        .catch(err => console.error(err));

    }, "image/jpeg", 0.9);
});

/* 🔄 NOVA FOTO  */
voltar.addEventListener("click", () => {
    // 1. Esconde a foto e o botão de voltar
    foto.style.display = "none";
    voltar.style.display = "none";
    
    // 2. Mostra o container da câmera novamente
    cameraContainer.style.display = "block";
    
    // 3. Limpa o SRC da foto anterior para não dar erro
    foto.src = "";
});

/* 🔙 VOLTAR PARA INSTRUÇÕES */
voltarInstrucao.addEventListener("click", () => {
    if (streamAtual) {
        streamAtual.getTracks().forEach(t => t.stop());
    }
    mostrarTela(precamera);
});
