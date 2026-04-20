import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { IoWarningOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";

import { useEffect, useState } from "react";

export default function Notification({
  message,
  type,
  duration = 6000,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  const notificationClasses = {
    success: {
      bgColor: "bg-emerald-500",
      icon: <IoCheckmarkCircleOutline size={24} />,
    },
    warning: {
      bgColor: "bg-yellow-500",
      icon: <IoWarningOutline size={24} />,
    },
    error: {
      bgColor: "bg-red-500",
      icon: <IoCloseCircleOutline size={24} />,
    },
  };

  const { bgColor, icon } = notificationClasses[type] ||
    notificationClasses.info || { bgColor: "bg-blue-500", icon: null };

  useEffect(() => {
    setIsVisible(true);
    setAnimationClass("animate-fade-in-down md:animate-fade-in-right");

    const timer = setTimeout(() => {
      setAnimationClass("animate-fade-out-up md:animate-fade-out-right");
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 500);
    }, duration - 500);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose, type]);

  if (!isVisible && animationClass === "") return null;

  return (
    <div
      className={`
        fixed z-50 p-4 rounded-lg shadow-lg text-white flex items-center gap-3 
        top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md 
        md:right-4 md:-translate-x-0 md:left-auto 
        ${bgColor} ${animationClass}
    `}
    >
      {icon}
      <p className="flex-grow">{message}</p>
      <button
        onClick={() => {
          setAnimationClass("animate-fade-out-up md:animate-fade-out-right");
          setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
          }, 500);
        }}
        className="ml-auto text-white hover:text-gray-200 focus:outline-none"
      >
        <IoCloseCircleOutline size={20} />
      </button>
    </div>
  );
}
