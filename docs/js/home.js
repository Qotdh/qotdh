var nodes = new vis.DataSet([
  { id: 0, label: 'في هذا الموقع', link: '#', x: 300, y: 0 },

  { id: 1, label: 'المقالات', link: './blog/', x: 100, y: -120 },
  { id: 2, label: 'التعليقات', link: './comments/', x: 100, y: -40 },
  { id: 3, label: 'الإبلاغ', link: './report/', x: 100, y: 40 },

  { id: 4, label: 'المشاريع', link: './projects/', x: 100, y: 120 },

  { id: 6, label: 'المستخدمين', link: './users/', x: -100, y: 160 },
]);

var edges = new vis.DataSet([
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 0, to: 3 },
  { from: 0, to: 4 },
  { from: 0, to: 6 },
  { from: 2, to: 3 },
  { from: 2, to: 1 },
  { from: 6, to: 3 },
  { from: 6, to: 4 },
  { from: 4, to: 1 },
]);

var container = document.getElementById('network');
var data = { nodes: nodes, edges: edges };

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
    chosen: false,
    borderWidth: 1,
    borderWidthSelected: 0
  },
  edges: {
    color: {
      color: '#888888',
      highlight: '#888888'
    },
    width: 1.2,
    hoverWidth: 0,
    selectionWidth: 0,
    smooth: true,
    hover: false
  },
  interaction: {
    dragNodes: true,
    dragView: true,
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

network.on("click", function (params) {
  if (params.nodes.length > 0) {
    const nodeId = params.nodes[0];
    const node = nodes.get(nodeId);
    const radius = 150;
const angles = [0, 60, 120, 180, 240, 300]; // درجات
const positions = angles.map(angle => {
  const rad = angle * Math.PI / 180;
  return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) };
});

    if (node && node.link) {
      window.location.href = node.link;
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
                    updateHTML += ` <div dir="rtl"class="update_line"> <span class="tr_txt "><ion-icon class="row_ion" name="return-down-back-outline"></ion-icon> الإضافات</span>:`;
                    data.newFeatures.forEach(feature => {
                        updateHTML += `<span class="tr_txt2">${feature}</span></div>`;
                    });
                }

                if (data.bugFixes.length > 0) {
                    updateHTML += ` <div dir="rtl" class="update_line"><span class="tr_txt "><ion-icon class="row_ion" name="return-down-back-outline"></ion-icon> الإصلاحات</span>: `;
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