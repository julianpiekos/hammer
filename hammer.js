(async function() {
    if (!window.html2canvas) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.onload = initHammerMode;
        document.body.appendChild(script);
    } else {
        initHammerMode();
    }

    function initHammerMode() {
        let hammerActive = false;

        const hammerBtn = document.createElement("button");
        hammerBtn.textContent = "🔨 Tryb Młota";
        Object.assign(hammerBtn.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 100000,
            padding: "10px 20px",
            fontSize: "16px",
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)"
        });
        document.body.appendChild(hammerBtn);

        hammerBtn.onclick = () => {
            hammerActive = !hammerActive;
            hammerBtn.textContent = hammerActive ? "❌ Wyłącz Młot" : "🔨 Tryb Młota";
            document.body.style.cursor = hammerActive ? "url('https://upload.wikimedia.org/wikipedia/commons/6/6c/Hammer_cursor.png'), auto" : "";
        };

        document.addEventListener("click", async (e) => {
            if (!hammerActive || e.target === hammerBtn) return;
            e.preventDefault();
            e.stopPropagation();

            const el = e.target;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const canvas = document.createElement("canvas");
            canvas.width = rect.width;
            canvas.height = rect.height;
            canvas.style.position = "fixed";
            canvas.style.left = rect.left + "px";
            canvas.style.top = rect.top + "px";
            canvas.style.pointerEvents = "none";
            canvas.style.zIndex = 999999;

            const ctx = canvas.getContext("2d");
            document.body.appendChild(canvas);

            const audio = new Audio("data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAAwAAAAACAAACZGF0YQAAAAA=");
            try { await audio.play(); } catch (e) {}

            html2canvas(el).then(snapshot => {
                ctx.drawImage(snapshot, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (let y = 0; y < canvas.height; y += 6) {
                    for (let x = 0; x < canvas.width; x += 6) {
                        const i = (y * canvas.width + x) * 4;
                        const r = imageData.data[i];
                        const g = imageData.data[i + 1];
                        const b = imageData.data[i + 2];
                        const a = imageData.data[i + 3] / 255;
                        if (a === 0) continue;

                        const dot = document.createElement("div");
                        dot.style.position = "fixed";
                        dot.style.width = "4px";
                        dot.style.height = "4px";
                        dot.style.left = rect.left + x + "px";
                        dot.style.top = rect.top + y + "px";
                        dot.style.background = `rgba(${r},${g},${b},${a})`;
                        dot.style.borderRadius = "50%";
                        dot.style.zIndex = 999999;
                        dot.style.transition = "transform 1s ease-out, opacity 1s ease-out";
                        document.body.appendChild(dot);

                        const angle = Math.random() * 2 * Math.PI;
                        const distance = 60 + Math.random() * 50;
                        const dx = Math.cos(angle) * distance;
                        const dy = Math.sin(angle) * distance;

                        requestAnimationFrame(() => {
                            dot.style.transform = `translate(${dx}px, ${dy}px)`;
                            dot.style.opacity = 0;
                        });

                        setTimeout(() => dot.remove(), 1000);
                    }
                }

                el.style.visibility = "hidden";
                setTimeout(() => canvas.remove(), 500);
            });
        }, true);
    }
})();
