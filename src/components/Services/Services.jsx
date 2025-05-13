import React from "react";

import { GiLightBulb } from "react-icons/gi";
import { GiTestTubes } from "react-icons/gi";
import { PiPi } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa";
import { GiDna1 } from "react-icons/gi";
import { RiComputerLine } from "react-icons/ri";
import { motion } from "framer-motion";

const ServicesData = [
  {
    id: 1,
    title: "Maths",
    link: "#",
    icon: <PiPi />,
    delay: 0.2,
  },
  {
    id: 2,
    title: "Physics",
    link: "#",
    icon: <GiLightBulb />,
    delay: 0.3,
  },
  {
    id: 3,
    title: "Chemistry",
    link: "#",
    icon: <GiTestTubes />,
    delay: 0.4,
  },
  {
    id: 4,
    title: "biology",
    link: "#",
    icon: <GiDna1 />,
    delay: 0.5,
  },
  {
    id: 5,
    title: "Computer Science",
    link: "#",
    icon: <RiComputerLine />,
    delay: 0.6,
  },
  {
    id: 6,
    title: "English",
    link: "#",
    icon: <FaBookOpen />,
    delay: 0.7,
  },
];

const SlideLeft = (delay) => {
  return {
    initial: {
      opacity: 0,
      x: 50,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: delay,
        ease: "easeInOut",
      },
    },
  };
};
const Services = () => {
  return (
    <section className="bg-white">
      <div className="container pb-14 pt-16">
        <h1 className="text-4xl font-bold text-left pb-10">
          Subjects
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
          {ServicesData.map((service) => (
            <motion.div
              variants={SlideLeft(service.delay)}
              initial="initial"
              whileInView={"animate"}
              viewport={{ once: true }}
              className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
            >
              <div className="text-4xl mb-4"> {service.icon}</div>
              <h1 className="text-lg font-semibold text-center px-3">
                {service.title}
              </h1>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;