 var nodes = new vis.DataSet([
  { id: 0, label: 'في هذا الموقع', title: '#' },
  { id: 1, label: 'المقالات', title: '../blog/' },
  { id: 2, label: 'التعليقات', title: '../blog/1/' },
  { id: 3, label: 'إبلاغ', title: '../blog/1/' },
  { id: 4, label: 'المشاريع', title: '../blog/1/' },
  { id: 5, label: 'كتبي', title: '../blog/1/' },
  { id: 6, label: 'شعر', title: '../blog/1/' },
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

function pluralizeArabic(count, singular, dual, plural) {
    if (count === 0) return `٠ ${plural}`; // للوضوح
    if (count >= 3 && count <= 10) return `${count} ${plural}`;
    return `${count} ${singular}`; // العدد فوق 10 يتبع المفرد في العربية
}

const parts = [];

if (diffMonths > 0) {
    parts.push(pluralizeArabic(diffMonths, 'شهر', 'شهرين', 'أشهر'));
} else if (diffWeeks > 0) {
    parts.push(pluralizeArabic(diffWeeks, 'أسبوع', 'أسبوعين', 'أسابيع'));
} else if (diffDays > 0) {
    parts.push(pluralizeArabic(diffDays, 'يوم', 'يومين', 'أيام'));
} else {
    if (diffHours > 0) {
        parts.push(pluralizeArabic(diffHours, 'ساعة', 'ساعتين', 'ساعات'));
    }
    if (diffMinutes > 0) {
        parts.push(pluralizeArabic(diffMinutes, 'دقيقة', 'دقيقتين', 'دقائق'));
    }
}

if (parts.length === 0) {
    parts.push(pluralizeArabic(diffSeconds, 'ثانية', 'ثانيتين', 'ثوانٍ'));
}

return parts.join(' و ');

}

function fetchUpdateDetails() {
        fetch("./update_log_ar.json")
            .then(response => response.json())
            .then(data => {
                let updateHTML =`<div class="update_line">   <span class="tr_txt ">الإنطلاق </span>: <span class="tr_txt2">${data.pub}</span><br></div>`;

            updateHTML += ` <div class="update_line">  <span class="tr_txt ">التحديث </span>: <span class="tr_txt2">${timeSinceUpdate(data.lastUpdate)}</span><br></div>`;

                if (data.newFeatures.length > 0) {
                    updateHTML += ` <div class="update_line"> <span class="tr_txt ">الإضافات</span>:`;
                    data.newFeatures.forEach(feature => {
                        updateHTML += `<span class="tr_txt2">${feature}</span></div>`;
                    });
                }

                if (data.bugFixes.length > 0) {
                    updateHTML += ` <div class="update_line"><span class="tr_txt ">التحسينات</span>: `;
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