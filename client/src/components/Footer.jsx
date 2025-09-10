import { BsFacebook, BsGithub, BsLinkedin, BsTwitter } from 'react-icons/bs'


function Footer() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  return (
    <footer className="bg-white py-5 lg:px-20 px-8 gap-4 w-full flex flex-col md:flex-row lg:flex-row justify-between items-center">
      <span className="lg:text-lg md:text-lg text-slate-600">
        Copyright @{currentYear} All rights reserved
      </span>

      <section className="flex items-center justify-center gap-5 text-2xl text-slate-400">
        <a
          href="https://www.facebook.com/share/1X32BL9gDL/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:text-blue-500 transition-transform transform hover:scale-125 hover:shadow-lg duration-300"
        >
          <BsFacebook />
        </a>

        <a
          href="https://www.linkedin.com/in/kiruthika-ganesan-b696b6200/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:text-blue-500 transition-transform transform hover:scale-125 hover:shadow-lg duration-300"
        >
          <BsLinkedin />
        </a>

        <a
          href="https://github.com/Kiruthinavi97"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:text-blue-500 transition-transform transform hover:scale-125 hover:shadow-lg duration-300"
        >
          <BsGithub />
        </a>

        <a
          href="https://x.com/kiruthi_97?s=21&t=RpWMk_94evVPw-oQRy9pug"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:text-blue-500 transition-transform transform hover:scale-125 hover:shadow-lg duration-300"
        >
          <BsTwitter />
        </a>
      </section>
    </footer>
  );
}

export default Footer;