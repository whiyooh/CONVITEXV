const modalLayer = document.getElementById("modal-layer");
const modalContent = document.getElementById("modal-content");
const openingVideo = document.getElementById("opening-video");

let currentModal = null;
let isModalTransitioning = false;
let openingTimer = null;

const VIDEO_FALLBACK_TIME = 8000;
// Definição dos dados para os modais//
const modals = {
manual: {
  title: "Tudo o que você precisa saber",
  image: "icons/manual (2).png",
  body: `
    <p>Para manter o encanto da noite intacto, siga estas orientações:</p>

      <ul>
        <li>Traje casual, com liberdade para toques de fantasia.</li>
        <li>Ajude-nos a preservar o clima agradável para todos que atravessarem a porta com você.</li>
        <li>Prepare-se para uma noite de arrepios, boas risadas e recordações.</li>
      </ul>
      
  `
},

gifts: {
    eyebrow: "Festa Fantasia",
    title: "Inscrições para festa fantasia",
    image: "icon presentes.png",
    body: `
      <p>Bora garantir sua vaga na festa mais assustadoramente boa do ano? Só seguir aqui:</p>
      <ul>
      <li>Inscreva-se no link: <a href="https://forms.gle/6g7k1Z2v5X8x3V9F9" target="_blank" rel="noopener">https://forms.gle/6g7k1Z2v5X8x3V9F9</a></li>
        <li>Confirme até dia 25/10 pra não ficar de fora.</li>
        <li>Seje assustadoramente criativo!</li>
      </ul>
    `
  },

  location: {
    eyebrow: "Festa",
    title: "Localização",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
    body: `
      <p><strong>Espaço da Festa</strong></p>
      <p> Aqui mesmo! Na UX Group<br></p>
      <p> Avenida Juruá, 548, aphaville</p>
      <p> Teremos um scaperoom no terceiro andar com uma decoração de arrepiar!</p>
      <p> prepare-se para se divertir e se assustar!</p>

      <div class="modal-actions">
        <a class="button" href="https://maps.app.goo.gl/eBpDKjgQDotDuZQo9" target="_blank" rel="noopener">
          Abrir no Google Maps
        </a>
      </div>
    `
  },
/* redirecionamento dos aperitivos  */
  rsvp: {
    eyebrow: "Aperitivos",
    title: "Aperitivos",
    image: "icon confirma.png",
    body: `
      <p>A mesa desta noite foi pensada para acompanhar o clima da festa. Algumas orientações:
<l>Aperitivos temáticos serão servidos à luz de velas durante a festa.</l>
<l>Teremos choop! Beba com moderação,nem todo efeito desaparece com o amanhecer.</l>
      </p>
      <div class="modal-actions">
      <a
  class="button"
  href="https://wa.me/5511969064545?text=Olá!%20Estou%20confirmando%20minha%20presença%20nos%2015%20da%20Maria%20Eduarda!!%20%0A%0ANome:"
  target="_blank"
  rel="noopener"
>
  combinado!
</a>
      </div>
    `
  }
};

function goToScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);

  if (target) {
    target.classList.add("active");
  }
}

function openPrintedEnvelope() {
  const envelope = document.querySelector(".printed-envelope");

  if (!envelope) return;

  envelope.classList.add("open");

  setTimeout(() => {
    goToScreen("screen-pre-invite");
  }, 1150);
}

function startOpeningVideo() {
  goToScreen("screen-video");

  const progress = document.querySelector(".progress");

  progress.classList.remove("running");
  void progress.offsetWidth;
  progress.classList.add("running");

  if (openingVideo) {
    openingVideo.currentTime = 0;
    openingVideo.volume = 0.5;
    openingVideo.muted = false;

    openingVideo.play().catch(() => {
      console.warn("O navegador bloqueou a reprodução automática com áudio.");
    });
  }

  clearTimeout(openingTimer);

  openingTimer = setTimeout(() => {
    finishOpeningVideo();
  }, 8000);
}

function finishOpeningVideo() {
  clearTimeout(openingTimer);

  if (openingVideo) {
    openingVideo.pause();
    openingVideo.currentTime = 0;
  }

  goToScreen("screen-invite");
}

function openModal(type) {
  if (isModalTransitioning) return;
  if (!modals[type]) return;
  if (!modalLayer || !modalContent) return;

  isModalTransitioning = true;
  currentModal = type;

  const modal = modals[type];

  modalContent.innerHTML = `
    <div class="modal-hero">
      <img src="${modal.image}" alt="" />
      <div class="modal-title-over">
        <h2 id="modal-title">${modal.title}</h2>
      </div>
    </div>

    <div class="modal-body">
      ${modal.body}

      ${type !== "rsvp" && type !== "location" ? `
        <div class="modal-actions">
          <button class="button" type="button" onclick="closeModal()">Fechar</button>
        </div>
      ` : ""}
    </div>
  `;

  modalLayer.classList.add("active");
  modalLayer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    isModalTransitioning = false;
  }, 360);
}

function closeModal() {
  if (!modalLayer || !modalContent) return;

  modalLayer.classList.remove("active");
  modalLayer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  currentModal = null;

  setTimeout(() => {
    if (!modalLayer.classList.contains("active")) {
      modalContent.innerHTML = "";
    }
  }, 260);
}

function confirmPresence() {
  if (!modalContent) return;

  currentModal = "confirmed";

  modalContent.innerHTML = `
    <div class="confirmed-state">
      <div class="confirmed-symbol">✓</div>
      <h2 id="modal-title">Presença confirmada</h2>
      <p>Sua presença foi confirmada com sucesso. Maria Eduarda ficará muito feliz em receber você.</p>

      <div class="modal-actions">
        <button class="button" type="button" onclick="closeModal()">
          Fechar
        </button>
      </div>
    </div>
  `;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalLayer?.classList.contains("active")) {
    closeModal();
  }
});
