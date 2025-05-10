 var nodes = new vis.DataSet([
  { id: 0, label: 'In this web', title: '#' },
  { id: 1, label: 'blog', title: './blog/' },
  { id: 2, label: 'comments', title: './comments/' },
  { id: 3, label: 'report', title: './report/' },
]);
// create an array with edges
var edges = new vis.DataSet([
  {from: 0, to: 1},
  {from: 0, to: 2},
  {from: 0, to: 3},
  {from: 0, to: 4},
  {from: 0, to: 5},
  {from: 0, to: 6},
  {from: 0, to: 7},
  {from: 0, to: 8},
  {from: 4, to: 9},
]);
// create a network
var container = document.getElementById('network');
var data = {
  nodes: nodes,
  edges: edges
};
  var options = {
    nodes: {
      shape: 'box',
      font: {
        color: "#ededed",
        face: 'monospace',
        size: 16,
        align: 'center'
      },
      color: {
        border: '#444444',
        background: "#1e1e1e",
      },
      widthConstraint: { minimum: 90 },
      heightConstraint: { minimum: 30 },
      shadow: false,
      hover: false,
      chosen: false, // ←←← مهم جدًا
      borderWidth: 1,
      borderWidthSelected: 0 // ←←← يوقف التأثير عند المرور
    },
    edges: {
      color: {
        color: '#888888',
        highlight: '#888888' // نفس اللون لتجنب التأثير
      },
      width: 1.2,
      hoverWidth: 0, // ←←← مهم
      selectionWidth: 0,
      smooth: true,
      hover: false
    },
    interaction: {
      dragNodes: true,
      zoomView: true,
      hover: false,
      keyboard: true,
      tooltips: false,
      highlightNearest: false,
      navigationButtons: false
    },
    tooltip: false
  };
var network = new vis.Network(container, data, options);
network.on("click", function(params) {
  if (params.nodes.length > 0) {
    const nodeId = params.nodes[0];
    const node = nodes.get(nodeId);
    if (node && node.title) {
      window.location.href = node.title;
    }
  }
});

// update card
function makeDraggable(box) {
    let isDragging = false, offsetX, offsetY, posX = 0, posY = 0;

    box.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - posX;
        offsetY = e.clientY - posY;
        box.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            posX = e.clientX - offsetX;
            posY = e.clientY - offsetY;
            box.style.transform = `translate(${posX}px, ${posY}px)`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        box.style.cursor = "grab";
    });
}
function timeSinceUpdate(lastUpdate) {
    const lastUpdateDate = new Date(lastUpdate);
    const now = new Date();
    const diffMs = now - lastUpdateDate;

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60) % 60;
    const diffHours = Math.floor(diffSeconds / 3600) % 24;
    const diffDays = Math.floor(diffSeconds / (3600 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30); // Approximation: 30 days per month

    function pluralize(value, singular, plural) {
        return value === 1 ? singular : plural;
    }

    const parts = [];
    if (diffMonths > 0) {
        parts.push(`${diffMonths} ${pluralize(diffMonths, 'month', 'months')}`);
    } else if (diffWeeks > 0) {
        parts.push(`${diffWeeks} ${pluralize(diffWeeks, 'week', 'weeks')}`);
    } else if (diffDays > 0) {
        parts.push(`${diffDays} ${pluralize(diffDays, 'day', 'days')}`);
    } else {
        if (diffHours > 0) {
            parts.push(`${diffHours} ${pluralize(diffHours, 'hour', 'hours')}`);
        }
        if (diffMinutes > 0) {
            parts.push(`${diffMinutes} ${pluralize(diffMinutes, 'min', 'min')}`);
        }
    }

    if (parts.length === 0) {
        parts.push(`${diffSeconds} ${pluralize(diffSeconds, 'second', 'seconds')}`);
    }
    return parts.join(', ');
}

function fetchUpdateDetails() {
        fetch("./update_log.json")
            .then(response => response.json())
            .then(data => {
                let updateHTML =``;

            updateHTML += ``;

                if (data.newFeatures.length > 0) {
                    updateHTML += ` <div class="update_line"> <span class="tr_txt ">features</span>:`;
                    data.newFeatures.forEach(feature => {
                        updateHTML += `<span class="tr_txt2">${feature}</span></div>`;
                    });
                }

                if (data.bugFixes.length > 0) {
                    updateHTML += ` <div class="update_line"><span class="tr_txt ">bugFixes</span>: `;
                    data.bugFixes.forEach(fix => {
                        updateHTML += `<span class="tr_txt2">${fix}</span></div>`;
                    });
                }
                
                document.getElementById("update-details").innerHTML = updateHTML;
            })
            .catch(() => {
                document.getElementById("update-details").textContent = "⚠️ فشل تحميل التحديثات!";
            });
    }
    fetchUpdateDetails();