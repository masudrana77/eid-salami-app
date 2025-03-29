document.addEventListener('DOMContentLoaded', loadLogs);

function loadLogs() {
  const logs = JSON.parse(localStorage.getItem('salamiLogs') || '[]');
  const tableBody = document.getElementById('logTableBody');

  tableBody.innerHTML = logs.length
    ? logs
        .map(
          log => `
        <tr>
            <td>${log.name}</td>
            <td>${log.ip}</td>
            <td>${log.amount}৳</td>
            <td>${log.date}</td>
        </tr>`
        )
        .join('')
    : "<tr><td colspan='4'>কোনও লগ নেই</td></tr>";
}

function clearLogs() {
  if (confirm('আপনি কি নিশ্চিত সকল লগ মুছে ফেলতে চান?')) {
    localStorage.removeItem('salamiLogs');
    loadLogs();
  }
}
