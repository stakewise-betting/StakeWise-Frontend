import { FaYoutube ,FaInstagram , FaDiscord , FaXTwitter} from "react-icons/fa6";


export const SocialIcons = () => (
  <div className="flex gap-2.5">
    <a href="#" aria-label="Twitter">
    <FaXTwitter size="28" />
    </a>
    <a href="#" aria-label="Instagram">
    <FaInstagram size="28" />
    </a>
    <a href="#" aria-label="YouTube">
    <FaYoutube size="28" />
    </a>
    <a href="#" aria-label="Discord">
    <FaDiscord size="28" />
    
    
    </a>
  </div>
);
