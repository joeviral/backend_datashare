// Frontend JS
const form = document.getElementById('giftForm');
const result = document.getElementById('result');
const previewBtn = document.getElementById('previewBtn');
const fakeAlert = document.getElementById('fakeAlert'); // Div for fake success

function buildMessage(phone, network, amount, message){
  const trimmed = message.trim();
  const final = trimmed.includes('{number}') 
    ? trimmed.replace('{number}', phone) 
    : trimmed + ' ' + phone;

  return `${final} — ${network} — NGN ${amount}`;
}

// PREVIEW BUTTON
previewBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const phone = document.getElementById('phone').value;
  const network = document.getElementById('network').value;
  const amount = document.getElementById('amount').value;
  const message = document.getElementById('message').value;

  if(!phone){ 
    alert('Please enter a phone number to preview'); 
    return; 
  }
  result.textContent = buildMessage(phone, network, amount, message);
});

// SUBMIT FORM
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
    const res = await fetch("https://backend-datashare-1.onrender.com/api/buy-airtime", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ network, phone, amount })
});

    const data = await res.json();

    if(res.ok){
      // Backend confirmation message
      result.textContent = data.text;

      // ⭐ Fake “Recipient Received Airtime” Message ⭐
      fakeAlert.innerHTML = `
        <div class="alert-box">
          <strong>${network} ALERT:</strong><br>
          ${phone} has just received NGN ${amount} airtime.<br>
          Thanks for using our service.
        </div>
      `;
      fakeAlert.style.display = "block";

      // ⭐ Trigger Fake SMS Popup ⭐
      showFakeSms(phone, amount, network);

    } else {
      result.textContent = 'Error: ' + (data.error || 'Failed to send');
    }

  } catch(err){
    result.textContent = 'Network error — could not reach server';
    console.error(err);
  }
});

// FAKE SMS POPUP
function showFakeSms(phone, amount, network) {
  const smsText = document.getElementById('smsText');
  smsText.textContent = 
    `You have received ${network} airtime of ₦${amount} from ${phone}.`;

  document.getElementById('fakeSmsPopup').classList.remove('hidden');
}

function closeSms() {
  document.getElementById('fakeSmsPopup').classList.add('hidden');
}
