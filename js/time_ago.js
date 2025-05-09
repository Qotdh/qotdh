      function getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const intervals = {
          year: 31536000,
          month: 2592000,
          day: 86400,
          hour: 3600,
          min: 60,
          second: 1
        };
        for (const [unit, value] of Object.entries(intervals)) {
          const count = Math.floor(seconds / value);
          if (count >= 1) {
            return `${count} ${unit}${count > 1 ? '' : ''} ago`;
          }
        }
        return "just now";
      }
      document.querySelectorAll(".time_ago").forEach(element => {
        const dateTime = element.textContent;
        element.textContent = getTimeAgo(dateTime);
      });