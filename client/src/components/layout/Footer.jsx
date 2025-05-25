import { FaFacebook, FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";


const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2">
        <p>© "Based on the original work by YT Dynamic Coding with Amit, further developed by [Chanon]"</p>
        <div className="flex items-center gap-4 justify-center text-2xl">
          <a href="" className="hover:text-primary-100">
          <FaFacebook />
          </a>
          <a href="https://github.com/Chanon2003" target='_blank' className="hover:text-primary-100">
          <FaGithub />
          </a>
          <a href="" className="hover:text-primary-100">
          <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  )
}
export default Footer