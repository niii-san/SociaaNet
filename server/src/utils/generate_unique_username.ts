// TODO: make more random. add numbers
// TODO: check if the username already exists
export default async function generateUniqueUsername(fullName: string) {
  const name = combineUsernameRandomly(fullName.split(" ")).toLowerCase();

  return name;
}

function combineUsernameRandomly(names: string[]) {
  const shuffNames = shuffleArray(names);
  const specialCharacters = ["_", "."];
  const combined = shuffNames.join(specialCharacters[0]);
  return combined;
}

function shuffleArray(arr: string[]) {
  if (arr.length == 1) return arr;

  let currentIndex = arr.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex]
    ];
  }

  return arr;
}
