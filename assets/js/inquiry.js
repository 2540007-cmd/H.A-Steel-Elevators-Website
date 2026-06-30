const form = document.getElementById('inquiry-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('success-msg');
const msgErr = document.getElementById('msg-err');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  msgErr.style.display = 'none';

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      successMsg.style.display = 'block';
      submitBtn.textContent = 'Sent';
      form.reset();
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Inquiry';
      alert('Something went wrong. Please try again or contact us directly.');
    }
  } catch (error) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Inquiry';
    alert('Network error. Please check your connection and try again.');
  }
});