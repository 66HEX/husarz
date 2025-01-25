import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

CustomEase.create("CustomEase", "M0,0 C0.25,0.1 0.25,1 1,1");


export const gsapConfig = {
    defaults: {
        ease: "CustomEase",
        duration: 1
    }
};

gsap.defaults(gsapConfig.defaults);