'use client'
import { FaPhone } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchRooms } from "@/redux/slices/roomsSlice";
import { AppDispatch, RootState } from "@/redux/store";

const Footer: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { rooms, loading, error } = useSelector(
      (state: RootState) => state.rooms
    );
  
    useEffect(() => {
        dispatch(fetchRooms({ page: 1, limit: 6, search: "", capacity: 0 }));
      }, [dispatch]);
  
    if(loading){
      return <div></div>
    }

    return (
        <div>
            <footer className="footer p-10 bg-gray-900 text-white justify-around">
                {/* Company Section */}
                <nav>
                    <h6 className="footer-title">Company</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Find Home</a>
                </nav>

                {/* Contact Section */}
                <nav>
                    <h6 className="footer-title">Contact Us</h6>
                    <a className="link link-hover flex gap-2">
                        <FaPhone /> 1-800-700-6200
                    </a>
                    <a className="link link-hover flex gap-2">
                        <IoMail /> info@roombooking.org
                    </a>
                    <a className="link link-hover flex gap-2">
                        <FaLocationDot /> 3015 Grand Ave, Coconut Grove, <br /> Merrick Way, FL 12345
                    </a>
                </nav>

                {/* Social Media Section */}
                <nav>
                    <h6 className="footer-title">Social Media</h6>
                    <div className="flex gap-3 text-[28px]">
                        <FaFacebook className="cursor-pointer" />
                        <FaSquareXTwitter className="cursor-pointer" />
                        <FaInstagramSquare className="cursor-pointer" />
                    </div>
                </nav>

                {/* Newsletter Section */}
                <form>
                    <h6 className="footer-title">Newsletter</h6>
                    <fieldset className="form-control w-80">
                        <label className="label">
                            <span className="label-text text-white">Enter your email address</span>
                        </label>
                        <div className="join">
                            <input
                                type="email"
                                placeholder="username@site.com"
                                className="input input-bordered join-item"
                            />
                            <button type="submit" className="btn btn-primary join-item -ml-3">
                                Subscribe
                            </button>
                        </div>
                    </fieldset>
                </form>
            </footer>
        </div>
    );
};

export default Footer;
