async function loadLogs() {
  try {
    const response = await fetch('/.netlify/functions/getLogs');
    const result = await response.json();
    const logs = result.map(item => item.data);
    
    const tableBody = document.getElementById('logTableBody');
    tableBody.innerHTML = logs.length
      ? logs.map(log => `
          <tr>
            <td>${log.name}</td>
            <td>${log.ip}</td>
            <td>${log.amount}৳</td>
            <td>${log.date}</td>
          </tr>`
        ).join('')
      : "<tr><td colspan='4'>কোনো লগ নেই</td></tr>";
  } catch (error) {
    console.error('Error loading logs:', error);
  }
}
