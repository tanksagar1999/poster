/**
 * Return ellipsis of a given string
 * @param {string} text
 * @param {number} size
 */
const ellipsis = (text, size) => {
  return `${text
    .split(' ')
    .slice(0, size)
    .join(' ')}...`;
};

function generate_random_string(string_length){
  let random_string = '';
  let random_ascii;
  let ascii_low = 65;
  let ascii_high = 90
  for(let i = 0; i < string_length; i++) {
      random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
      random_string += String.fromCharCode(random_ascii)
  }
  return random_string
}

function generate_random_number(size){
  let num =10
  for(let i=0;i<size-2;i++){
    num = num*10
  }

  let val = Math.floor(num + Math.random() * 9000);
  return val
}



export { ellipsis , generate_random_string , generate_random_number };
