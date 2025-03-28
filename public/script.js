// Updated loadLogs function with better error handling and UI feedback
async function loadLogs() {
  const tableBody = document.getElementById('logTableBody');
  
  try {
    // Show loading state
    tableBody.innerHTML = '<tr><td colspan="4">লগ ডাটা লোড হচ্ছে...</td></tr>';
    
    const response = await fetch('/.netlify/functions/getLogs');
    
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    
    const result = await response.json();
    
    // Handle both FaunaDB and direct array responses
    const logs = Array.isArray(result) ? result : 
                (result.data ? result.data.map(item => item.data) : []);
    
    if (logs.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4">কোনো লগ নেই</td></tr>';
      return;
    }
    
    tableBody.innerHTML = logs.map(log => `
      <tr>
        <td>${log.name || 'N/A'}</td>
        <td>${log.ip || 'N/A'}</td>
        <td>${log.amount ? log.amount + '৳' : 'N/A'}</td>
        <td>${log.date || 'N/A'}</td>
      </tr>`
    ).join('');
    
  } catch (error) {
    console.error('Error loading logs:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="error">
          লগ ডাটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।
        </td>
      </tr>`;
  }
}

// Updated saveLog function with retry mechanism
async function saveLog(data) {
  const maxRetries = 2;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      const response = await fetch('/.netlify/functions/saveLog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      retryCount++;
      console.error(`Attempt ${retryCount} failed:`, error);
      
      if (retryCount === maxRetries) {
        // Fallback to localStorage if server save fails
        console.warn('Falling back to localStorage');
        const logs = JSON.parse(localStorage.getItem('salamiLogs') || []);
        logs.push(data);
        localStorage.setItem('salamiLogs', JSON.stringify(logs));
        return { status: 'local_storage_fallback' };
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }
  }
}

// Updated generateSalami integration
async function generateSalami() {
  // ... [previous code until salamiData creation]
  
  const salamiData = {
    name: userName,
    ip: ip,
    amount: randomAmount,
    date: new Date().toLocaleString('bn-BD')
  };

  // Save to both systems
  localStorage.setItem('lastSalami', JSON.stringify(salamiData));
  await saveLog(salamiData);
  
  // ... [rest of your existing code]
}

// Add this to your CSS
.error {
  color: #e74c3c;
  font-weight: bold;
}
