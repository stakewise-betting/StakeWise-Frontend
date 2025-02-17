import logo from "@/assets/images/logo.png";
import { FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import footer01 from "@/assets/images/footer01.png";
import footer02 from "@/assets/images/footer02.png";
import footer03 from "@/assets/images/footer03.png";
import {Link} from "react-router-dom";


const Footer = () => {
  return (
    <footer className="text-base my-10">
      <hr className=" border-DFsecondary mb-10" />
      <div className="container mx-auto px-5 sm:px-0">
        {/* first Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 text-center lg:text-start ">
          <div className="flex gap-3 lg:col-span-4 justify-center lg:justify-start ">
            <img src={logo} alt="Logo" className="h-[42px] w-[51px]" />
            <h2 className="font-saira-stencil text-[32px] pt-3 ">STAKEWISE</h2>
          </div>
          <div>
            <h2 className="text-white font-bold mb-4">Markets</h2>
            <ul className="space-y-2">
              <li>Politics</li>
              <li>Sports</li>
              <li>Upcoming Events</li>
              <li>All</li>
            </ul>
          </div>
          <div>
            <h2 className="text-white font-bold mb-4">Resources</h2>
            <ul className="flex flex-col space-y-2">
               <Link to="/contactus">Contact Us</Link>
               <Link to="/results">Results</Link>
            </ul>
          </div>
          <div>
            <h2 className="text-white font-bold mb-4">Join the community </h2>

            <ul className="flex gap-3 justify-center lg:justify-start">
              <li>
                <FaXTwitter size="28" />
              </li>
              <li>
                <FaInstagram size="28" />
              </li>
              <li>
                <FaYoutube size="28" />
              </li>
              <li>
                <FaDiscord size="28" />
              </li>
            </ul>
          </div>
        </div>

        <hr className=" border-DFsecondary my-10" />

        {/* Second Section */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 font-bold text-xs">
          <div className="flex flex-col items-center text-center gap-3">
            <img src={footer01} alt="" />
            <span>MAIN PARTNER</span>
          </div>
          <div className="flex flex-col items-center  text-center gap-5">
            <img src={footer03} alt="" />
            <span>EXCLUSIVE TITLE PARTNER</span>
          </div>
          <div className="flex  flex-col items-center justify-center text-center gap-3">
            <img src={footer01} alt="" />
            <span>COMPLIANCE AND LICENSING PARTNER</span>
          </div>
          <div className="flex  flex-col items-center justify-center text-center gap-3">
            <img src={footer02} alt="" />
            <span>OFFICIAL BETTING PARTNER</span>
          </div>
        </div>

        <hr className=" border-DFsecondary my-10 " />

        {/* Third section */}
        <div className="text-center">
          <p className="">
            StakeWise is committed to promoting responsible betting. If you or
            someone you know needs support, visit{" "}
            <a
              href="https://gamblingtherapy.org"
              className=" underline"
            >
              GamblingTherapy.org
            </a>{" "}
            for resources.
          </p>
          <p className="mt-2 ">
            StakeWise is owned and operated by SecureChain Technologies Ltd.,
            registration number: 2145789, with its registered address at 12
            Innovation Street, TechCity, Gibraltar. For inquiries, contact us at
            support@stakewise.com. Payment processing services are managed by
            SecurePay Solutions Ltd., located at 45 Commerce Road, Larnaca,
            Cyprus, registration number: HE 508742.
          </p>
          <p className="mt-2 ">Bet responsibly. 18+ only. T&Cs apply.</p>
          <p className="mt-2 ">
            Support: support@stakewise.com | Partners: partners@stakewise.com |
            Press: press@stakewise.com
          </p>
        </div>

        <hr className=" border-DFsecondary my-10" />

        {/* last section */}
        <div className="pb-10 flex sm:flex-row flex-col gap-5 sm:justify-between items-center">
          <p>StakeWise @ 2024. All rights reserved.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline flex gap-2 items-center">
            <TbWorld />
              EN
            </a>
            
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
