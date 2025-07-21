import { Button } from "@/components/ui/button";
import { FiFacebook } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";

export const SocialIcons = () => (
  <div className="flex justify-center sm:justify-start gap-3">
    <Button
      variant="outline"
      size="icon"
      className="w-10 h-10 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/30 hover:border-[#1877F2]/50 transition-all duration-300 group"
    >
      <FiFacebook
        className="text-[#1877F2] group-hover:scale-110 transition-transform duration-300"
        size={18}
      />
      <span className="sr-only">Facebook</span>
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/30 hover:border-[#1DA1F2]/50 transition-all duration-300 group"
    >
      <FaXTwitter
        className="text-[#1DA1F2] group-hover:scale-110 transition-transform duration-300"
        size={18}
      />
      <span className="sr-only">Twitter</span>
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FEDA75]/10 via-[#D62976]/10 to-[#962FBF]/10 hover:bg-gradient-to-br hover:from-[#FEDA75]/20 hover:via-[#D62976]/20 hover:to-[#962FBF]/20 border-[#D62976]/30 hover:border-[#D62976]/50 transition-all duration-300 group"
    >
      <FaInstagram
        className="text-[#D62976] group-hover:scale-110 transition-transform duration-300"
        size={18}
      />
      <span className="sr-only">Instagram</span>
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="w-10 h-10 rounded-full bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border-[#FF0000]/30 hover:border-[#FF0000]/50 transition-all duration-300 group"
    >
      <FiYoutube
        className="text-[#FF0000] group-hover:scale-110 transition-transform duration-300"
        size={18}
      />
      <span className="sr-only">YouTube</span>
    </Button>
  </div>
);
