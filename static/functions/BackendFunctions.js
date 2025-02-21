    document.addEventListener('DOMContentLoaded', function() {
      const pasteBtn = document.getElementById('pasteBtn');
      const inputText = document.getElementById('inputText');
      const operationType = document.getElementById('operationType');
      const encodeBtn = document.getElementById('encodeBtn');
      
      // Update button text based on operation type
      operationType.addEventListener('change', function() {
        if (this.value === 'encode') {
          encodeBtn.textContent = 'Encode →';
          document.querySelector('.floating-label').textContent = '𝗘𝗻𝗰𝗼𝗱𝗲𝗱 𝗢𝘂𝘁𝗽𝘂𝘁';
        } else {
          encodeBtn.textContent = 'Decode →';
          document.querySelector('.floating-label').textContent = '𝗗𝗲𝗰𝗼𝗱𝗲𝗱 𝗢𝘂𝘁𝗽𝘂𝘁';
        }
      });
      
      pasteBtn.addEventListener('click', async function() {
        try {
          const text = await navigator.clipboard.readText();
          inputText.value = text;
        } catch (err) {
          console.error('Failed to read clipboard contents: ', err);
          alert('Could not access clipboard. Please check your browser permissions.');
        }
      });
    });
  // Main encoding/decoding function
async function processText() {
  const inputText = document.getElementById('inputText').value;
  const method = document.getElementById('encodingMethod').value;
  const operation = document.getElementById('operationType').value;
  const outputContainer = document.getElementById('outputContainer');
  const outputText = document.getElementById('outputText');
  
  // Show loading message
  const operationName = operation === 'encode' ? 'Encoding' : 'Decoding';
  showNotification(`${operationName}...`, 'info');
  
  // Validate input
  if (!inputText.trim()) {
    showNotification(`Please enter some text to ${operation}`, 'error');
    return;
  }
  
  try {
    // Prepare URL with parameters
    const encodedText = encodeURIComponent(inputText);
    const url = `/${operation}?method=${method}&text=${encodedText}`;
    
    // Fetch result
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const result = await response.text();
    
    // Display result
    outputText.value = result;
    outputContainer.style.display = 'block';
    showNotification(`Text ${operation}d using ${method}`, 'success');
    
  } catch (error) {
    console.error(`${operationName} failed:`, error);
    showNotification(`Failed to ${operation} text.`, 'error');
  }
}

// Copy encoded/decoded text to clipboard
function copyToClipboard() {
  const outputText = document.getElementById('outputText');
  
  // Check if there's text to copy
  if (!outputText.value.trim()) {
    showNotification('Nothing to copy', 'info');
    return;
  }
  
  // Copy to clipboard
  outputText.select();
  document.execCommand('copy');
  
  // Deselect text
  window.getSelection().removeAllRanges();
  
  showNotification('Copied to clipboard!', 'success');
}

// Clear all fields and reset the form
function clearAll() {
  document.getElementById('inputText').value = '';
  document.getElementById('outputText').value = '';
  document.getElementById('outputContainer').style.display = 'none';
  document.getElementById('encodingMethod').selectedIndex = 0;
  
  showNotification('All fields cleared', 'info');
}

// Notification system
function showNotification(message, type) {
  // Remove any existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = message;
  
  // Style the notification based on type
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#1dc46e';
      break;
    case 'error':
      notification.style.backgroundColor = '#EF4444';
      break;
    case 'info':
      notification.style.backgroundColor = '#e6e345';
      break;
  }
  
  // Apply common styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'black',
    zIndex: '1000',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    opacity: '0',
    transform: 'translateY(-10px)',
    maxWidth: '300px'
  });
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Update encode button reference
  const encodeBtn = document.getElementById('encodeBtn');
  
  // Process button
  encodeBtn.addEventListener('click', processText);
  
  // Copy button
  document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
  
  // Clear button
  document.getElementById('clearBtn').addEventListener('click', clearAll);
  
  // Enter key in input field to process
  document.getElementById('inputText').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processText();
    }
  });

  // Add CSS for notifications
  const style = document.createElement('style');
  style.textContent = `
    @keyframes notificationFadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .notification {
      animation: notificationFadeIn 0.3s ease forwards;
    }
  `;
  document.head.appendChild(style);
});