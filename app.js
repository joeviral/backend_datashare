// Frontend JS
const form = document.getElementById('giftForm');
const result = document.getElementById('result');
const previewBtn = document.getElementById('previewBtn');

function buildMessage(phone, network, amount, message){
  const trimmed = message.trim();
  const final = trimmed.includes('{number}')
    ? trimmed.replace('{number}', phone)
    : trimmed + ' ' + phone;
  return `${final} — ${network} — NGN ${amount}`;
}

previewBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const phone = document.getElementById('phone').value;
  const network = document.getElementById('network').value;
  const amount = document.getElementById('amount').value;
  const message = document.getElementById('message').value;

  if(!phone){
    alert("Please enter a phone number to preview");
    return;
  }

  result.textContent = buildMessage(phone, network, amount, message);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const phone = document.getElementById('phone').value;
  const network = document.getElementById('network').value;
  const amount = document.getElementById('amount').value;
  const message = document.getElementById('message').value;

  if(!phone || !amount){
    alert("Please fill all fields");
    return;
  }

  // Show confirmation text on page
  result.textContent = `Confirmation sent to ${phone} for NGN ${amount} (${network})`;

  // Show fake SMS popup
  showFakeSms(phone, amount, network);
});

// FAKE SMS POPUP
function showFakeSms(phone, amount, network){
  const smsText = document.getElementById("smsText");
  smsText.textContent =
    `You have received ${network} airtime of ₦${amount} from ${phone}.`;

  document.getElementById("fakeSmsPopup").classList.remove("hidden");
}

function closeSms(){
  document.getElementById("fakeSmsPopup").classList.add("hidden");
}
