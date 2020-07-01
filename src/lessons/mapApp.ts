import axios from 'axios';
// ^^^ this pisses me off

const form = document.querySelector('form')!;
const addInp = document.getElementById('address')! as HTMLInputElement;

function searchAddHandle(e: Event) {
  e.preventDefault();
  const address = addInp.value;

  axios.get;
}

form.addEventListener('submit', searchAddHandle);
