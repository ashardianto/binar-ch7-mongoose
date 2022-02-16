const button = document.querySelector('button');
const result = document.getElementById('result');
const submit = document.querySelector('[type=submit]');

const resultTextInit = result.textContent;
const chance = ['winner', 'lose', 'draw'];

let totalResult = [];

button.addEventListener('click', e => {
  const results = [];
  result.textContent = '';

  for (let i = 0; i < 3; i++) {
    const random = chance[
      Math.floor(
        Math.random() * chance.length
      )
    ];

    results.push(random);
    result.textContent += random + '\n\r'
  }

  if (!result.textContent.includes('No result.')) {
    submit.disabled = false;
    totalResult = results;
  }
});

submit.addEventListener('click', async (e) => {
  e.preventDefault();

  const target = e.currentTarget;
  const form = target.closest('form');
  const url = form.action;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      result: totalResult
    })
  });

  const data = await response.json();

  if (!data.room) {
    return;
  }

  const { result } = data.room;
  const lastResult = result[result.length - 1];

  const ul = document.querySelector('ul');

  const list = document.createElement('li');
  const p = document.createElement('p');

  const resultElement = document.getElementById('with-result');
  const noResultElem = document.getElementById('no-result');
  
  p.textContent = lastResult.join(',');
  list.appendChild(p);

  if (ul) {
    ul.appendChild(list);
  } else {
    const createUl = document.createElement('ul');
    createUl.appendChild(list);
    resultElement.appendChild(createUl);
  }

  submit.disabled = true;
  noResultElem && noResultElem.remove();
})
