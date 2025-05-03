import { Button } from "@/components/ui/button";
import { FiFacebook } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";

export const SocialIcons = () => (
  <div className="flex gap-2">
    <Button
      variant="outline"
      size="icon"
      className="rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/50"
    >
      <FiFacebook className="text-[#1877F2]" />
      <span className="sr-only">Facebook</span>
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/50"
    >
      <FaXTwitter className="text-[#1DA1F2]" />
      <span className="sr-only">Twitter</span>
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="rounded-full bg-gradient-to-br from-[#FEDA75]/10 via-[#D62976]/10 to-[#962FBF]/10 hover:bg-gradient-to-br hover:from-[#FEDA75]/20 hover:via-[#D62976]/20 hover:to-[#962FBF]/20 border-[#D62976]/50"
    >
      <FaInstagram className="text-[#D62976]" />
      <span className="sr-only">Instagram</span>
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="rounded-full bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border-[#FF0000]/50"
    >
      <FiYoutube className="text-[#FF0000]" />
      <span className="sr-only">YouTube</span>
    </Button>
  </div>
);
