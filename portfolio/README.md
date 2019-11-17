# Setup Typescript

```$xslt
# Create a new folder
mkdir chapter-2
cd chapter-2

# Initialize a new NPM project (follow the prompts)
npm init

# Install TSC, TSLint, and type declarations for NodeJS
npm install --save-dev typescript tslint @types/node
```
Create a new file called tsconfig.json in your root folder 
```shell script
touch tsconfig.json
```
then pop it open in your code editor and give it the following contents:
```json
{
  "compilerOptions": {
    "lib": ["es2015"],
    "module": "commonjs",
    "outDir": "dist",
    "sourceMap": true,
    "strict": true,
    "target": "es2015"
  },
  "include": [
    "src"
  ]
}
```

The following command will generate a tslint.json file with a default TSLint configuration:
```$xslt
./node_modules/.bin/tslint --init
```

Then, compile and run your TypeScript code:
```$xslt
# Compile your TypeScript with TSC
./node_modules/.bin/tsc

# Run your code with NodeJS
node ./dist/index.js
```


### References

* [Strongly typed Event Emmiters with conditional types: For Event and Command Bus?](https://medium.com/@bterlson/strongly-typed-event-emitters-2c2345801de8)

