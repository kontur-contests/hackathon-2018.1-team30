const GuiWrapper = document.createElement("div");

Object.assign(GuiWrapper.style, {
  position: "fixed",
  width: "100vw",
  height: "100vh",
  top: 0,
  left: 0,
  boxShadow: "inset 0 0 50px 12px rgba(0,0,0,0.3)",
  fontFamily: "Helvetica, Segoe UI, sans-serif"
});

const Loader = document.createElement("div");
Object.assign(Loader.style, {
  position: "fixed",
  width: "100vw",
  height: "100vh",
  top: 0,
  left: 0,
  background: "rgba(0,0,0,1)",
  transition: "background-color 0.2s ease-out",
  display: "none"
});
GuiWrapper.appendChild(Loader);

const Welcome = document.createElement("div");
Object.assign(Welcome.style, {
  padding: "180px 40px",
  background: "rgba(255,255,255,0.7)",
  height: "100vh",
  boxSizing: "border-box",
  opacity: 1,
  transition: "opacity 0.2s ease-out",
  textAlign: "center"
});
Welcome.innerHTML = `
  <h1 style="text-align: center;font-size: 120px;letter-spacing: 3px;font-weight: 300;">Slawwan & Дииччь</h1>
  <h2>Ищем игроков</h2>
  <ul style="text-align: left; width: 200px; margin: auto;">
    <li>Готов</li>
    <li>....</li>
    <li>....</li>
    <li>....</li>
  </ul>
`;

export class GUI {
  static init() {
    document.body.appendChild(GuiWrapper);
    return GUI;
  }

  static showLoader() {
    Loader.style.display = "block";
    return GUI;
  }

  static hideLoader() {
    Loader.style.background = "rgba(0,0,0,0)";
    return GUI;
  }

  static showWelcome() {
    GuiWrapper.appendChild(Welcome);
    return GUI;
  }

  static hideWelcome() {
    Welcome.style.opacity = "0";
    setTimeout(() => {
      GuiWrapper.removeChild(Welcome);
    }, 200);
    return GUI;
  }

  static setPlayersCount(count: number) {
    Welcome.querySelectorAll("li").forEach(x => {
      if (--count > 0) {
        x.innerText = "Готов";
      } else {
        x.innerText = "...";
      }
    });

    return GUI;
  }
}
