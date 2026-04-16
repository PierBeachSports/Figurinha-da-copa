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

const loading = document.getElementById("loading");
const mensagemFinal = document.getElementById("mensagemFinal");
const mensagemInstrucao = document.getElementById("mensagemInstrucao");

let streamAtual = null;

function mostrarTela(tela) {
    intro.style.display = "none";
    introtext.style.display = "none";
    precamera.style.display = "none";
    conteudotext.style.display = "none";
    tela.style.display = "flex";
}

videoIntro.addEventListener("ended", () => {
    mostrarTela(introtext);
    setTimeout(() => {
        mostrarTela(precamera);
    }, 8000);
});

async function abrirCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
        });
        streamAtual = stream;
        video2.srcObject = stream;
    } catch (err) {
        alert("Erro ao acessar câmera: " + err.message);
        console.error(err);
    }
}

btnIrCamera.addEventListener("click", () => {
    mostrarTela(conteudotext);
    abrirCamera();
});

btn.addEventListener("click", () => {
    const w = video2.videoWidth;
    const h = video2.videoHeight;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video2, 0, 0, w, h);

    loading.style.display = "flex";

    canvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", "foto-pier");

        fetch("https://api.cloudinary.com/v1_1/dirryk3le/image/upload", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            foto.src = data.secure_url;

            loading.style.display = "none";
            cameraContainer.style.display = "none";
            foto.style.display = "block";
            voltar.style.display = "block";

        document.getElementById("resultadoBox").style.display = "block";
        })
        .catch(err => {
            console.error(err);
            loading.style.display = "none";
        });

    }, "image/jpeg", 0.9);
});

voltar.addEventListener("click", () => {
    foto.style.display = "none";
    voltar.style.display = "none";
    document.getElementById("resultadoBox").style.display = "none";
    loading.style.display = "none";

    cameraContainer.style.display = "block";
    foto.src = "";
});

voltarInstrucao.addEventListener("click", () => {
    if (streamAtual) {
        streamAtual.getTracks().forEach(t => t.stop());
    }
    mostrarTela(precamera);
});
