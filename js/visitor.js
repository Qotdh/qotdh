  const binId = '681892908561e97a500e23e3';
  const apiKey = '$2a$10$i1l81AJctANJasEfWHI72O2KAqNQ0tDEwmTpjvZfHN2jePuCCtYuW';

  const ONE_DAY = 24 * 60 * 60 * 1000; // 24 ساعة بالملي ثانية
  const now = Date.now();
  const lastVisit = localStorage.getItem('lastVisit');

  // جلب عدد الزوار الحالي وعرضه
  async function fetchCounter() {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: { 'X-Master-Key': apiKey }
      });
      const data = await res.json();
      document.getElementById("counter").innerText = ` ${data.record.visits} visitor`;
    } catch (err) {
      console.error("فشل في جلب البيانات:", err);
      document.getElementById("counter").innerText = "فشل تحميل عدد الزوار";
    }
  }

  // زيادة العداد بواحد
  async function incrementCounter() {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: { 'X-Master-Key': apiKey }
      });
      const data = await res.json();
      const newCount = data.record.visits + 1;

      await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': apiKey
        },
        body: JSON.stringify({ visits: newCount })
      });

      console.log("✅ تم تحديث عدد الزوار");
    } catch (err) {
      console.error("❌ فشل في تحديث العدد", err);
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    // جلب العدد عند تحميل الصفحة
    fetchCounter();

    // تحقق إن مرّت 24 ساعة أو أكثر على آخر زيارة
    if (!lastVisit || now - lastVisit > ONE_DAY) {
      await incrementCounter();
      localStorage.setItem('lastVisit', now);
    }

    // يمكن تحديث العدد كل فترة طويلة لو أردت
    setInterval(fetchCounter, 60000); // كل 30 ثانية
  });
