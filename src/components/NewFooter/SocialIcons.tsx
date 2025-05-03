import { FaYoutube ,FaInstagram , FaDiscord , FaXTwitter} from "react-icons/fa6";



export const SocialIcons = () => (
  <div className="flex gap-2.5">
  <a href="#" aria-label="Twitter" className="text-[#ffffff] hover:text-blue-500 transition-transform transform hover:scale-110 duration-200">
    <FaXTwitter size="28" />
  </a>
  <a href="#" aria-label="Instagram" className="text-[#ffffff] hover:text-pink-500 transition-transform transform hover:scale-110 duration-200">
    <FaInstagram size="28" />
  </a>
  <a href="#" aria-label="YouTube" className="text-[#ffffff] hover:text-red-600 transition-transform transform hover:scale-110 duration-200">
    <FaYoutube size="28" />
  </a>
  <a href="#" aria-label="Discord" className="text-[#ffffff] hover:text-indigo-500 transition-transform transform hover:scale-110 duration-200">
    <FaDiscord size="28" />
  </a>
</div>

);
