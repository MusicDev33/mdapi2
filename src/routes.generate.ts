import fs from 'fs';

console.log(__dirname);

const getDirs = (folder: string): string[] => {
  const totalPath = `${__dirname}/${folder}`;

  const contents = fs.readdirSync(totalPath);

  const folders = contents.filter(file => {
    return fs.statSync(`${totalPath}/${file}`).isDirectory();
  });

  return folders;
}

// Get files minus routes.ts and export.ts
const getFiles = (folder: string): string[] => {
  const totalPath = `${__dirname}/${folder}`;
  const contents = fs.readdirSync(totalPath);

  const folders = contents.filter(file => {
    if (fs.statSync(`${totalPath}/${file}`).isDirectory()) {
      return false;
    }

    if (file === 'routes.ts' || file === 'export.ts') {
      return false;
    }

    return true;
  });

  return folders;
}

const genExports = (folder: string, files: string[]) => {
  let fileContents = '';

  for (let file of files) {
    fileContents += `export * from './${file.split('.')[0]}';`;
    fileContents += '\n';
  }

  fs.writeFileSync(`${__dirname}/${folder}/export.ts`, fileContents);
  console.log(`export.ts written for ${folder}`);
}

const titleCase = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.substring(1);
}


const createRouteName = (route: string) => {
  const routeWords = route.split('-');
  let finalWord = '';

  for (let word of routeWords) {
    finalWord += titleCase(word);
  }

  return finalWord;
}

(async () => {
  const routes = getDirs('routes');

  let routeFileContents = '';

  for (let route of routes) {
    const files = getFiles(`routes/${route}`);

    genExports(`routes/${route}`, files);

    routeFileContents += `import ${createRouteName(route)}Routes from '@routes/${route}/routes';`
    routeFileContents += '\n';
  }

  routeFileContents += '\nexport { ';

  for (let route of routes) {
    routeFileContents += `${createRouteName(route)}Routes, `;
  }

  routeFileContents += '};\n';

  fs.writeFileSync(`${__dirname}/config/route-defs.ts`, routeFileContents);
})();
