const path = require( "path" );

module.exports = {
  context: path.join( __dirname, "src" ),
  entry: {
    app: "./client.js",
  },
  resolve: {
    modules: [
      path.resolve( "./src" ),
      "node_modules",
    ],
  },
  output: {
    path: path.resolve( __dirname, "build" ),
    filename: 'fragments.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        },
      },
    ],
  },
};
