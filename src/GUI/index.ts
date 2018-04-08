const GuiWrapper = document.createElement("div");

const style = document.createElement("style");
style.innerHTML = `
@font-face {
  font-family: "Origa";
  src: url("origa.ttf");
}
`;
document.head.appendChild(style);

Object.assign(GuiWrapper.style, {
  position: "fixed",
  width: "100vw",
  height: "100vh",
  top: 0,
  left: 0,
  boxShadow: "inset 0 0 50px 12px rgba(0,0,0,0.3)",
  fontFamily: "Origa",
  cursor: "none"
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
  padding: "60px 40px",
  background: "rgba(255,255,255,0.7)",
  height: "100vh",
  boxSizing: "border-box",
  opacity: 1,
  transition: "opacity 0.2s ease-out",
  textAlign: "center",
  color: "#333"
});
Welcome.innerHTML = `
  <h1 style="text-align: center;font-size: 120px;letter-spacing: 3px;font-weight: 300; width: 900px; margin: auto">Slawwan & DICH</h1>
  <h2 style="font-size: 60px;">Waiting for players</h2>
  <ul style="text-align: left; width: 200px; margin: auto; font-size: 40px">
    <li>Ready</li>
    <li>....</li>
    <li>....</li>
    <li>....</li>
  </ul>
`;

const score = document.createElement("div");
Object.assign(score.style, {
  position: "fixed",
  left: "100px",
  top: "100px",
  fontSize: "50px",
  transition: "transform 0.2s ease-in"
});

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
        x.innerText = "Ready";
      } else {
        x.innerText = "...";
      }
    });

    return GUI;
  }

  static showScore() {
    GuiWrapper.appendChild(score);
    return GUI;
  }

  static updateScore(value: number) {
    if (score.innerText !== value.toString()) {
      score.style.transform = "scale(1.2)";
      setTimeout(() => {
        score.style.transform = "scale(1)";
      }, 50);
    }
    score.innerText = value.toString();
    if (value > 500 && value < 1000) {
      score.style.color = "yellow";
    } else if (value >= 1000 && value < 2000) {
      score.style.color = "orange";
    } else if (value >= 2000) {
      score.style.color = "red";
    }
    return GUI;
  }
}
