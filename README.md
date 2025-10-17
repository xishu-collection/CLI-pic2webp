<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/xishu-collection/CLI-pic2webp">
    <img src="_proj_images/logo.webp" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">CLI-pic2webp</h3>

  <p align="center">
    A command-line tool only focus converting photos and images to WebP format directly on your local machine.
    <br />
    <br />
    <a href="https://github.com/xishu-collection/CLI-pic2webp/issues/new?labels=bug">Report Bugs</a>
    &middot;
    <a href="https://github.com/xishu-collection/CLI-pic2webp/issues/new?labels=enhancement">Request Features</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>ToC</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#backlogs">Backlogs</a></li>
    <li>
		<a href="#issue-and-pr">Issue and PR</a>
		<ul>
        <li><a href="#contributors">Contributors</a></li>
      </ul>
	</li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This is a nodejs integration project of converting photos and images to WebP format on your local machine.

Why is this CLI necessary? 

Because your photos or images always contain sensitive information from you
that shouldn’t be passed thru the internet (where privacy isn’t guaranteed) -- but only on your own machine, where you maintain full control.

This is a handy tool to help you to do that.

There is no network connection function in this tool.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Pnpm][pnpm]][pnpm-url]
* [![Node][Node.js]][Node-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started


### Prerequisites

* ```pnpm``` environment setup

### Installation

#### Local build and install:
1. Clone the repo
   ```sh
   git clone https://github.com/xishu-collection/CLI-pic2webp.git
   ```
2. Install the dependencies
   ```sh
   pnpm install
   ```
3. Run the tool in project
   ```sh
   pnpm start
   ```
4. Link the tool to global environment
   ```sh
   npm link
   ```
5. Uninstall the tool if needed
   ```sh
   npm unlink -g
   ```
6. Run the tool in CLI
   ```sh
   xs-pic2webp
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

```
CLI > xs-pic2webp

> xs-pic2webp@1.0.0 start
> node index.js

Welcome to the Image to WebP Converter!

Usage examples:
  - Convert single file: -i <file path>
  - Convert directory: -d <directory path>
  - More parameters, view help: -h/h or --help/help
  - Exit program: exit or quit


Please enter command parameters: h
Usage:  [options]

Options:
  -i, --input <path>       Input file path
  -d, --directory <path>   Input directory path (choose one with -i)
  -o, --output <path>      Output directory path (if not specified, just use the same folder from -i or -d)
  -q, --quality <number>   Image quality (1-100) (default: "80")
  -l, --lossless <number>  Compression level (1: lossy, 2: medium, 3: lossless) (default: "1")
  -m, --minimal <boolean>  Force minimal file size regardless of compression level (default: "false")
  -h, --help               display help for command


Please enter command parameters: -d D:\test
Parameter check passed, preparing to start processing...
Found 6 files, starting conversion...
× Conversion failed [a.pdf]: Input file contains unsupported image format
× Conversion failed [b.mp4]: Input file contains unsupported image format
√ Conversion successful: c.jpg -> c-generated.webp
√ Conversion successful: d.jpg -> d-generated.webp
√ Conversion successful: e.png -> e-generated.webp
√ Conversion successful: f.png -> f-generated.webp

Conversion completed! Success: 4 file(s), Time: 1.5s


Please enter command parameters: -i D:\g.jpg
Parameter check passed, preparing to start processing...
√ Conversion successful: g.jpg -> g-generated.webp

Conversion completed! Success: 1 file(s), Time: 1.1s


Please enter command parameters: -i D:\g.jpg
Parameter check passed, preparing to start processing...
√ Conversion successful: g.jpg -> g-generated1.webp

Conversion completed! Success: 1 file(s), Time: 1.1s
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Backlogs

- [x] only focus on the .webp format
- [x] provide handy cli usage
- [ ] monitor one folder to automatically convert the pictures to the .webp format
- [ ] binary executable file for different platforms


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Issue and PR

- Let me know if you've found an [issue](https://github.com/xishu-collection/CLI-pic2webp/issues/new).
- Let me know if you needs new [enhancement](https://github.com/xishu-collection/CLI-pic2webp/issues/new?labels=enhancement).
- Any contributions you make are **Welcomed and Greatly Appreciated**.
	1. Fork the project and clone to your local
	2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
	3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
	4. Push to your feature branch (`git push -u origin feature/AmazingFeature`)
	5. Open a Pull Request


<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Contributors:

<a href="https://github.com/xishu-collection/CLI-pic2webp/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=xishu-collection/CLI-pic2webp" alt="contrib.rocks image" />
</a>


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Author: xishu2099 - GitHub: [@shallowlong](https://github.com/shallowlong) - Email: shallowlong@gmail.com

Project Link: [https://github.com/xishu-collection/CLI-pic2webp](https://github.com/xishu-collection/CLI-pic2webp)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [sharp](https://github.com/lovell/sharp)
* [xishu-collection](https://github.com/xishu-collection)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/xishu-collection/CLI-pic2webp.svg?style=for-the-badge
[contributors-url]: https://github.com/xishu-collection/CLI-pic2webp/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/xishu-collection/CLI-pic2webp.svg?style=for-the-badge
[forks-url]: https://github.com/xishu-collection/CLI-pic2webp/network/members
[stars-shield]: https://img.shields.io/github/stars/xishu-collection/CLI-pic2webp.svg?style=for-the-badge
[stars-url]: https://github.com/xishu-collection/CLI-pic2webp/stargazers
[issues-shield]: https://img.shields.io/github/issues/xishu-collection/CLI-pic2webp.svg?style=for-the-badge
[issues-url]: https://github.com/xishu-collection/CLI-pic2webp/issues
[license-shield]: https://img.shields.io/github/license/xishu-collection/CLI-pic2webp.svg?style=for-the-badge
[license-url]: LICENSE


[npm]: https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white
[npm-url]: https://www.npmjs.com/
[pnpm]: https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white
[pnpm-url]: https://www.npmjs.com/
[webpack]: https://img.shields.io/badge/webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=white
[webpack-url]: https://www.webpackjs.com/
[.ENV]: https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=white
[.ENV-url]: https://www.dotenv.org/


[Node.js]: https://img.shields.io/badge/node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/

[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Fontawesome.com]: https://img.shields.io/badge/Fontawesome-538DD7?style=for-the-badge&logo=fontawesome&logoColor=white
[Fontawesome-url]: https://fontawesome.com/


[Electronjs.org]: https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white
[Electronjs-url]: https://www.electronjs.org/
[MySQL.com]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/
