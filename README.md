## Animation:
![Animation showing how Custom Image works](img/creation_process.gif "Custom Image in Action")

# Small Symfony 4 Application to create Custom Thumbnail Images

## 

## Built using the following Components
* Symfony 4.2
* Webpack Encore.
* React.
    * Main JavaScript classes are lazy loaded (code splitting) when modal is created.
* node-sass-json-importer: facilitates sharing of variables between SASS and JavaScript.
* liip/imagine-bundle: Image manipulation using Imagine. The following components ensure that no error is thrown when image is positioned with negative margins 
    * App\Imagine\Filter\Loader\CustomCropFilter
    * App\Imagine\Image\Point 

## Installation
If you really want to install the app locally then you can:

```
cd to/parent/directory
git clone https://github.com/hurnell/custom-image-creator.git
cd custom-image-creator
composer install
yarn install
```
Then run one of the scripts in package.json:
```
yarn progress
or
yarn dev-server
or
yarn build
```
