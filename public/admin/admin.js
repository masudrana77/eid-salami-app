document.addEventListener('DOMContentLoaded', () => {
  loadLogs();
  setupAutoRefresh();
});

function loadLogs() {
  try {
    const logs = JSON.parse(localStorage.getItem('salamiLogs') || [];
    const tableBody = document.getElementById('logTableBody');
    
    if (!tableBody) {
      console.error('Table body element not found!');
      return;
    }

    tableBody.innerHTML = logs.length
      ? logs.map(log => `
          <tr>
              <td>${log.name || 'N/A'}</td>
              <td>${log.ip || 'N/A'}</td>
              <td>${log.amount ? log.amount + '৳' : 'N/A'}</td>
              <td>${log.date || 'N/A'}</td>
          </tr>`).join('')
      : "<tr><td colspan='4'>কোনও লগ নেই</td></tr>";

  } catch (error) {
    console.error('Error loading logs:', error);
    alert('লগ ডাটা লোড করতে সমস্যা হয়েছে!');
  }
}

function clearLogs() {
  if (confirm('আপনি কি নিশ্চিত সকল লগ মুছে ফেলতে চান?')) {
    localStorage.removeItem('salamiLogs');
    loadLogs();
    alert('সকল লগ মুছে ফেলা হয়েছে!');
  }
}

// নতুন ডাটা আসলে অটো রিফ্রেশের ব্যবস্থা
function setupAutoRefresh() {
  window.addEventListener('storage', (event) => {
    if (event.key === 'salamiLogs') {
      loadLogs();
    }
  });
}
