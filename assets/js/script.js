(() => {
    const clock = document.getElementById("clock");
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    if (clock) {
        const time = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        const tick = () => {
            clock.textContent = time.format(new Date());
        };

        tick();
        setInterval(tick, 30_000);
    }
})();
