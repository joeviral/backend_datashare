// Frontend JS
const form = document.getElementById('giftForm');
const result = document.getElementById('result');
const previewBtn = document.getElementById('previewBtn');
const fakeAlert = document.getElementById('fakeAlert'); // NEW DIV for fake success

function buildMessage(phone, network, amount, message){
  const trimmed = message.trim();
  const final = trimmed.includes('{number}') ? trimmed.replace('{number}', phone) : trimmed + ' ' + phone;
  return `${final} — ${network} — NGN ${amount}`;
}

previewBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const phone = document.getElementById('phone').value;
  const network = document.getElementById('network').value;
  const amount = document.getElementById('amount').value;
  const message = document.getElementById('message').value;
  if(!phone){ alert('Please enter a phone number to preview'); return; }
  result.textContent = buildMessage(phone, network, amount, message);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const phone = document.getElementById('phone').value;
  const network = document.getElementById('network').value;
  const amount = document.getElementById('amount').value;
  const message = document.getElementById('message').value;

  if(!phone || !amount){ 
    alert('Please provide phone and amount'); 
    return; 
  }
  
  const payload = { phone, network, amount, message };

  result.textContent = 'Sending confirmation...';

  try{
    const res = await fetch('https://backend-datashare-1.onrender.com/api/gift', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if(res.ok){
      result.textContent = data.text;

      // ⭐ NEW: FAKE “RECIPIENT RECEIVED AIRTIME” MESSAGE ⭐
      fakeAlert.innerHTML = `
        <div class="alert-box">
          <strong>${network} ALERT:</strong><br>
          ${phone} has just received NGN ${amount} airtime.<br>
          Thanks for using our service.
        </div>
      `;
      fakeAlert.style.display = "block";

    } else {
      result.textContent = 'Error: ' + (data.error || 'Failed to send');
    }

  } catch(err){
    result.textContent = 'Network error — could not reach server';
    console.error(err);
  }
});
